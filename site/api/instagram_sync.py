"""Sincronização sob demanda do Instagram por scraping protegido."""

from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

import instaloader
import requests

from scripts.sync_instagram import PROFILE, Settings, SupabaseRest, image_urls, loader

MAX_SCANNED_POSTS = 60
MAX_NEW_POSTS = 12


class handler(BaseHTTPRequestHandler):
    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "private, no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        origin = self.headers.get("Origin")
        host = self.headers.get("Host")
        if origin and urlparse(origin).netloc != host:
            self.send_json(403, {"error": "Origem inválida."})
            return

        supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
        api_key = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "")
        authorization = self.headers.get("Authorization", "")
        if not supabase_url or not api_key:
            self.send_json(503, {"error": "Supabase não configurado no servidor."})
            return
        if not authorization.startswith("Bearer "):
            self.send_json(401, {"error": "Sessão expirada."})
            return

        token = authorization.removeprefix("Bearer ").strip()
        settings = Settings(supabase_url, api_key, token, None, None)
        api = SupabaseRest(settings)
        try:
            user_response = requests.get(
                f"{supabase_url}/auth/v1/user",
                headers=api.headers,
                timeout=20,
            )
            if user_response.status_code != 200:
                self.send_json(401, {"error": "Sessão expirada."})
                return
            user_id = user_response.json().get("id")
            staff = api.request(
                "GET",
                "/rest/v1/staff_members",
                params={"user_id": f"eq.{user_id}", "select": "role"},
            ).json()
            if not staff or staff[0].get("role") not in {"owner", "admin"}:
                self.send_json(403, {"error": "Esta conta não tem acesso às aprovações."})
                return

            known_rows = api.request(
                "GET",
                "/rest/v1/instagram_captures",
                params={"select": "instagram_shortcode"},
            ).json()
            known = {row["instagram_shortcode"] for row in known_rows}
            posts = instaloader.Profile.from_username(
                loader(settings).context,
                PROFILE,
            ).get_posts()
            created = 0
            skipped = 0
            scanned = 0
            for post in posts:
                if scanned >= MAX_SCANNED_POSTS or created >= MAX_NEW_POSTS:
                    break
                scanned += 1
                if post.shortcode in known:
                    skipped += 1
                    continue
                urls = image_urls(post)
                if not urls:
                    skipped += 1
                    continue
                capture = api.create_capture(post)
                for position, source_url in enumerate(urls):
                    api.upload_media(capture["id"], post.shortcode, position, source_url)
                created += 1
                known.add(post.shortcode)

            self.send_json(
                200,
                {"created": created, "skipped": skipped, "scanned": scanned},
            )
        except instaloader.exceptions.InstaloaderException:
            self.send_json(
                502,
                {"error": "O Instagram bloqueou temporariamente a leitura pública. Tente novamente mais tarde."},
            )
        except requests.RequestException:
            self.send_json(502, {"error": "Falha temporária ao acessar Instagram ou Supabase."})
        except Exception:
            self.send_json(500, {"error": "Não foi possível concluir a sincronização."})

    def do_GET(self) -> None:
        self.send_json(405, {"error": "Método não permitido."})
