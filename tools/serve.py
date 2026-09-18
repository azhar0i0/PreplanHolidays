"""Local preview with Vercel-style clean URLs:  python tools/serve.py [port]"""
import http.server, os, sys, functools
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = path.split('?')[0].split('#')[0]
        rel = p.lstrip('/')
        full = os.path.join(ROOT, rel)
        if rel and os.path.isfile(full): return full
        if rel and os.path.isdir(full) and os.path.isfile(os.path.join(full, 'index.html')): return os.path.join(full, 'index.html')
        if rel and os.path.isfile(full.rstrip('/') + '.html'): return full.rstrip('/') + '.html'
        if not rel: return os.path.join(ROOT, 'index.html')
        return os.path.join(ROOT, '404.html')
    def log_message(self, *a): pass
port = int(sys.argv[1]) if len(sys.argv) > 1 else 3111
http.server.ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
