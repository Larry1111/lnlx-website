#!/usr/bin/env python3
"""Minimal local static web server with explicit UTF-8 headers for lnlx-website."""

from __future__ import annotations

import errno
import functools
import http.server
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent


class ReusableThreadingHTTPServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True


class Utf8StaticHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".htm": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
        ".svg": "image/svg+xml; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".webp": "image/webp",
        ".ico": "image/x-icon",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main() -> None:
    requested_port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    host = "127.0.0.1"
    handler = functools.partial(Utf8StaticHandler, directory=str(ROOT_DIR))

    server = None
    actual_port = requested_port
    for offset in range(21):
        candidate = requested_port + offset
        try:
            server = ReusableThreadingHTTPServer((host, candidate), handler)
            actual_port = candidate
            break
        except OSError as err:
            if err.errno == errno.EADDRINUSE and offset < 20:
                if offset == 0:
                    print(f"Port {requested_port} is already in use; trying next available port...", flush=True)
                continue
            raise

    assert server is not None
    print(f"Serving {ROOT_DIR} at http://{host}:{actual_port}/", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
