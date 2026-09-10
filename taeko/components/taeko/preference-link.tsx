"use client";

import { useCallback } from "react";

export function PreferenceLink({
  preference,
  children,
}: {
  preference: string;
  children: React.ReactNode;
}) {
  const selectPreference = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("taeko:preference", { detail: { preference } }),
    );
  }, [preference]);

  return (
    <a className="preference-link" href="#planejador" onClick={selectPreference}>
      {children}
    </a>
  );
}
