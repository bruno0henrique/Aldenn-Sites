"""Sincronização manual e conservadora do Instagram para a fila de curadoria."""

from __future__ import annotations

import argparse
import os
import re
import sys
import uuid
from dataclasses import dataclass
from datetime import timezone
from pathlib import Path

import instaloader
import requests

PROFILE = "bellelandcloset"
PRODUCT_TAG = "#bellelandproduto"
BUCKET = "product-media"


@dataclass(frozen=True)
class Settings:
    url: str
    service_key: str
    instagram_username: str | None
    session_file: str | None

    @classmethod
    def from_env(cls) -> "Settings":
        url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        if not url or not key:
            raise RuntimeError("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.")
        return cls(url, key, os.getenv("INSTAGRAM_USERNAME") or None, os.getenv("INSTAGRAM_SESSIONFILE") or None)


class SupabaseRest:
    def __init__(self, settings: Settings) -> None:
        self.url = settings.url
        self.headers = {"apikey": settings.service_key, "Authorization": f"Bearer {settings.service_key}"}

    def request(self, method: str, path: str, **kwargs):
        response = requests.request(method, f"{self.url}{path}", headers={**self.headers, **kwargs.pop("headers", {})}, timeout=45, **kwargs)
        response.raise_for_status()
        return response

    def find_capture(self, shortcode: str):
        response = self.request("GET", "/rest/v1/instagram_captures", params={"instagram_shortcode": f"eq.{shortcode}", "select": "id"})
        rows = response.json()
        return rows[0] if rows else None

    def create_capture(self, post):
        caption = post.caption or ""
        first_line = next((line.strip() for line in caption.splitlines() if line.strip() and PRODUCT_TAG not in line.lower()), f"Peça {post.shortcode}")
        payload = {"instagram_shortcode": post.shortcode, "source_url": f"https://www.instagram.com/p/{post.shortcode}/", "raw_caption": caption, "captured_at": post.date_utc.replace(tzinfo=timezone.utc).isoformat(), "proposed_name": first_line[:120], "proposed_description": caption[:2000], "status": "pending_review"}
        return self.request("POST", "/rest/v1/instagram_captures", json=payload, headers={"Prefer": "return=representation"}).json()[0]

    def refresh_capture_source(self, capture_id: int, post) -> None:
        payload = {"source_url": f"https://www.instagram.com/p/{post.shortcode}/", "raw_caption": post.caption or "", "captured_at": post.date_utc.replace(tzinfo=timezone.utc).isoformat(), "source_missing": False}
        self.request("PATCH", "/rest/v1/instagram_captures", params={"id": f"eq.{capture_id}"}, json=payload)

    def media_positions(self, capture_id: int) -> set[int]:
        rows = self.request("GET", "/rest/v1/capture_media", params={"capture_id": f"eq.{capture_id}", "select": "source_position"}).json()
        return {row["source_position"] for row in rows}

    def upload_media(self, capture_id: int, shortcode: str, position: int, source_url: str) -> None:
        image = requests.get(source_url, timeout=45)
        image.raise_for_status()
        content_type = image.headers.get("content-type", "image/jpeg").split(";")[0]
        extension = {"image/png": "png", "image/webp": "webp"}.get(content_type, "jpg")
        storage_path = f"captures/{shortcode}/{uuid.uuid4().hex}.{extension}"
        self.request("POST", f"/storage/v1/object/{BUCKET}/{storage_path}", data=image.content, headers={"Content-Type": content_type, "x-upsert": "false"})
        public_url = f"{self.url}/storage/v1/object/public/{BUCKET}/{storage_path}"
        payload = {"capture_id": capture_id, "source_position": position, "source_url": source_url, "storage_path": storage_path, "public_url": public_url, "mime_type": content_type}
        self.request("POST", "/rest/v1/capture_media", json=payload)

    def mark_missing(self, present_shortcodes: set[str]) -> None:
        rows = self.request("GET", "/rest/v1/instagram_captures", params={"select": "id,instagram_shortcode"}).json()
        for row in rows:
            if row["instagram_shortcode"] not in present_shortcodes:
                self.request("PATCH", "/rest/v1/instagram_captures", params={"id": f"eq.{row['id']}"}, json={"source_missing": True})


def image_urls(post) -> list[str]:
    if post.typename == "GraphSidecar":
        return [node.display_url for node in post.get_sidecar_nodes() if not node.is_video]
    return [] if post.is_video else [post.url]


def loader(settings: Settings) -> instaloader.Instaloader:
    instance = instaloader.Instaloader(download_pictures=False, download_videos=False, save_metadata=False, compress_json=False, quiet=True)
    if settings.instagram_username and settings.session_file:
        instance.load_session_from_file(settings.instagram_username, filename=settings.session_file)
    return instance


def main() -> int:
    parser = argparse.ArgumentParser(description="Captura posts com #bellelandproduto para revisão.")
    parser.add_argument("--full", action="store_true", help="Percorre todos os posts e sinaliza fontes removidas.")
    args = parser.parse_args()
    settings = Settings.from_env()
    api = SupabaseRest(settings)
    posts = instaloader.Profile.from_username(loader(settings).context, PROFILE).get_posts()
    present: set[str] = set()
    captured = 0
    for post in posts:
        caption = post.caption or ""
        if PRODUCT_TAG not in caption.lower():
            continue
        present.add(post.shortcode)
        existing = api.find_capture(post.shortcode)
        if existing and not args.full:
            break
        capture = existing or api.create_capture(post)
        api.refresh_capture_source(capture["id"], post)
        known = api.media_positions(capture["id"])
        for position, source_url in enumerate(image_urls(post)):
            if position not in known:
                api.upload_media(capture["id"], post.shortcode, position, source_url)
        captured += 1
    if args.full:
        api.mark_missing(present)
    print(f"Sincronização concluída: {captured} post(s) processado(s).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"Falha segura: {error}. Nenhum produto foi publicado automaticamente.", file=sys.stderr)
        raise SystemExit(1)
