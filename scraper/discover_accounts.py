"""
카테고리별 해시태그를 훑어서 팔로워 1만 명 이상 계정을 찾아
Supabase tracked_accounts 테이블에 채워 넣습니다.

한 번 실행할 때마다 카테고리당 DISCOVER_BATCH_PER_CATEGORY(기본 20)명 정도만
새로 찾도록 설계했습니다. 이걸 cron으로 주기적으로(예: 30분~1시간마다) 돌리면
계정 차단 위험 없이 천천히 목표치(TARGET_PER_CATEGORY)까지 채워집니다.
"""
import logging
import random
import time

from config import (
    TREND_CATEGORIES,
    MIN_FOLLOWERS,
    TARGET_PER_CATEGORY,
    DISCOVER_BATCH_PER_CATEGORY,
    DELAY_MIN,
    DELAY_MAX,
)
from session import get_client
import supabase_client as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("discover")


def sleep_a_bit():
    time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))


def discover_category(cl, category: dict) -> int:
    key = category["key"]
    current_count = db.count_tracked_accounts(key)
    if current_count >= TARGET_PER_CATEGORY:
        log.info("[%s] 이미 목표치(%d) 도달, 건너뜀", key, TARGET_PER_CATEGORY)
        return 0

    known = db.get_known_usernames(key)
    state_key = f"discover_cursor:{key}"
    state = db.get_state(state_key, default={"hashtag_index": 0})
    hashtags = category["hashtags"]

    found_this_run = 0
    attempts = 0

    while found_this_run < DISCOVER_BATCH_PER_CATEGORY and attempts < len(hashtags):
        hashtag = hashtags[state["hashtag_index"] % len(hashtags)]
        try:
            medias = cl.hashtag_medias_recent(hashtag, amount=DISCOVER_BATCH_PER_CATEGORY * 3)
        except Exception as exc:
            log.warning("[%s] #%s 해시태그 조회 실패: %s", key, hashtag, exc)
            medias = []
        sleep_a_bit()

        candidates = []
        for media in medias:
            username = getattr(media.user, "username", None)
            if username and username not in known:
                candidates.append(username)
                known.add(username)

        if not candidates:
            state["hashtag_index"] += 1
            db.set_state(state_key, state)
            attempts += 1
            continue

        rows = []
        for username in candidates:
            if found_this_run >= DISCOVER_BATCH_PER_CATEGORY:
                break
            try:
                info = cl.user_info_by_username(username)
            except Exception as exc:
                log.warning("[%s] @%s 프로필 조회 실패: %s", key, username, exc)
                sleep_a_bit()
                continue
            sleep_a_bit()

            if (info.follower_count or 0) >= MIN_FOLLOWERS:
                rows.append(
                    {
                        "category": key,
                        "username": username,
                        "follower_count": info.follower_count,
                        "full_name": info.full_name or None,
                        "profile_pic_url": str(info.profile_pic_url) if info.profile_pic_url else None,
                    }
                )
                found_this_run += 1

        db.upsert_tracked_accounts(rows)
        log.info(
            "[%s] #%s 에서 %d명 신규 등록 (누적 %d/%d)",
            key,
            hashtag,
            len(rows),
            current_count + found_this_run,
            TARGET_PER_CATEGORY,
        )

        state["hashtag_index"] += 1
        db.set_state(state_key, state)
        attempts += 1

    return found_this_run


def main():
    cl = get_client()
    for category in TREND_CATEGORIES:
        try:
            discover_category(cl, category)
        except Exception as exc:
            log.exception("[%s] 처리 중 오류: %s", category["key"], exc)


if __name__ == "__main__":
    main()
