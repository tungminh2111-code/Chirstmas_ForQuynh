from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # This line tells the browser: "It's okay to use these files safely"
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    port = 8000
    print(f"✅ Running CORS-enabled server at http://localhost:{port}")
    try:
        HTTPServer(('', port), CORSRequestHandler).serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")