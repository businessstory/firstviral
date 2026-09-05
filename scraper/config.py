import os

from dotenv import load_dotenv

load_dotenv()

TREND_CATEGORIES = [
    {
        "key": "beauty",
        "label": "뷰티/패션",
        "hashtags": ["뷰티", "패션스타그램", "뷰티스타그램", "화장품추천", "데일리룩"],
    },
    {
        "key": "food",
        "label": "맛집/음식",
        "hashtags": ["맛집", "맛스타그램", "먹스타그램", "카페스타그램", "맛집추천"],
    },
    {
        "key": "fitness",
        "label": "운동/건강",
        "hashtags": ["운동", "헬스타그램", "다이어트", "홈트", "헬스"],
    },
    {
        "key": "influencer",
        "label": "인플루언서",
        "hashtags": ["인플루언서", "인스타그래머", "협찬", "체험단", "바이럴"],
    },
    {
        "key": "selfdev",
        "label": "자기개발",
        "hashtags": ["자기계발", "자기개발", "동기부여", "루틴스타그램", "갓생"],
    },
]

MIN_FOLLOWERS = int(os.environ.get("MIN_FOLLOWERS", "10000"))

# 카테고리당 최종 목표 계정 수. 5개 카테고리 x 2000 = 총 1만 개.
TARGET_PER_CATEGORY = int(os.environ.get("TARGET_PER_CATEGORY", "2000"))

# 한 번 실행(cron 1회)마다 카테고리당 새로 찾는 계정 수.
# 작게 유지할수록 계정 차단 위험이 낮아지고, 목표치까지 도달하는 데 시간이 더 걸립니다.
DISCOVER_BATCH_PER_CATEGORY = int(os.environ.get("DISCOVER_BATCH_PER_CATEGORY", "20"))

# 한 번 실행(cron 1회)마다 릴스를 동기화할 계정 수 (오래 동기화 안 된 순서로 처리).
SYNC_BATCH_SIZE = int(os.environ.get("SYNC_BATCH_SIZE", "30"))
REELS_PER_ACCOUNT = int(os.environ.get("REELS_PER_ACCOUNT", "5"))
MAX_POST_AGE_DAYS = int(os.environ.get("MAX_POST_AGE_DAYS", "30"))

# 요청 사이 대기 시간(초). 인스타그램 차단 회피를 위한 최소한의 안전장치입니다.
# 절대 줄이지 마세요 (계정 정지 위험이 커집니다).
DELAY_MIN = float(os.environ.get("DELAY_MIN", "3"))
DELAY_MAX = float(os.environ.get("DELAY_MAX", "7"))

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
IG_USERNAME = os.environ["IG_USERNAME"]
IG_PASSWORD = os.environ["IG_PASSWORD"]

SESSION_FILE = os.environ.get("SESSION_FILE", "ig_session.json")
