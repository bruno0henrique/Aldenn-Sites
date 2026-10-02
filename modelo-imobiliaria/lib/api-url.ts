/** Preview-only loopback proxy: production API remains same-origin. */
export function apiUrl(path: string) { return typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname) ? `http://127.0.0.1:5176${path}` : path; }
