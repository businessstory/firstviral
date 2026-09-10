"""
Vercel(고정 IP 없음) -> 이 서버(고정 IP 있음) -> 알리고(Aligo) 순서로
문자 발송 요청을 중계하는 아주 작은 프록시 서버입니다.

알리고가 "등록된 고정 IP에서만 API 요청 허용"을 요구해서,
이 서버의 고정 IP를 알리고에 등록해두고 Vercel은 이 서버를 거쳐서 보냅니다.
"""
import http.server
import json
import os
import urllib.error
import urllib.parse
import urllib.request
from dotenv import load_dotenv

load_dotenv()

PROXY_SECRET = os.environ["PROXY_SECRET"]
ALIGO_API_KEY = os.environ["ALIGO_API_KEY"]
ALIGO_USER_ID = os.environ["ALIGO_USER_ID"]
ALIGO_SENDER = os.environ["ALIGO_SENDER"]
PORT = int(os.environ.get("PORT", "8443"))


class Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/aligo-send":
            self.send_response(404)
            self.end_headers()
            return
        if self.headers.get("X-Proxy-Secret") != PROXY_SECRET:
            self.send_response(401)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        try:
            body = json.loads(self.rfile.read(length))
        except Exception:
            self.send_response(400)
            self.end_headers()
            return

        receiver = body.get("receiver", "")
        msg = body.get("msg", "")

        # 한국 통신사 SMS 망은 EUC-KR 인코딩을 쓰기 때문에, 한글이 깨지지 않으려면
        # UTF-8이 아니라 EUC-KR 기준으로 퍼센트 인코딩해서 보내야 합니다.
        # 이모지 등 EUC-KR로 표현 안 되는 글자가 섞여 있으면 여기서 에러가 나므로,
        # 서버가 죽지 않게 안전하게 400으로 응답합니다.
        try:
            data = urllib.parse.urlencode(
                {
                    "key": ALIGO_API_KEY,
                    "user_id": ALIGO_USER_ID,
                    "sender": ALIGO_SENDER,
                    "receiver": receiver,
                    "msg": msg,
                },
                encoding="euc-kr",
            ).encode("ascii")
        except UnicodeEncodeError as e:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(
                json.dumps(
                    {"error": "unsupported_character", "detail": str(e)}
                ).encode()
            )
            return

        req = urllib.request.Request(
            "https://apis.aligo.in/send/",
            data=data,
            method="POST",
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                result = resp.read()
                status = resp.status
        except urllib.error.HTTPError as e:
            result = e.read()
            status = e.code
        except Exception as e:
            result = json.dumps({"error": str(e)}).encode()
            status = 502

        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(result)

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
