import os

from instagrapi import Client

from config import IG_USERNAME, IG_PASSWORD, SESSION_FILE, DELAY_MIN, DELAY_MAX


def get_client() -> Client:
    cl = Client()
    cl.delay_range = [DELAY_MIN, DELAY_MAX]

    if os.path.exists(SESSION_FILE):
        cl.load_settings(SESSION_FILE)
        try:
            cl.get_timeline_feed()  # 세션이 아직 살아있는지 가볍게 확인
        except Exception:
            cl.login(IG_USERNAME, IG_PASSWORD)
    else:
        cl.login(IG_USERNAME, IG_PASSWORD)

    cl.dump_settings(SESSION_FILE)
    return cl
