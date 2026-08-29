#!/usr/bin/env python3
"""
Fact-Based Intelligence Dashboard Local Dev Server
"""
import http.server
import socketserver
import os
import sys

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.mjs'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        return super().guess_type(path)

def run():
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    # Try binding to port, fallback if in use
    for p in range(port, port + 10):
        try:
            with socketserver.TCPServer(("", p), Handler) as httpd:
                print(f"==================================================")
                print(f" FACT MATRIX Dashboard Server Running")
                print(f" URL: http://localhost:{p}")
                print(f" Directory: {web_dir}")
                print(f"==================================================")
                httpd.serve_forever()
        except OSError:
            print(f"Port {p} is in use, trying {p+1}...")
            continue

if __name__ == '__main__':
    run()
