"""
tracked_accounts에 등록된 계정들을 오래 동기화되지 않은 순서대로 돌면서
최근 릴스를 긁어와 trending_reels에 저장합니다.

한 번 실행할 때 SYNC_BATCH_SIZE(기본 30)개 계정만 처리하도록 되어 있어서,
cron으로 주기적으로 돌리면 전체 계정을 천천히 순환하며 동기화합니다.
계정 수가 많을수록(예: 1만 개) 한 바퀴 도는 데 걸리는 시간이 길어집니다.
"""
import logging
import random
import time
from datetime import datetime, timedelta, timezone

from config import SYNC_BATCH_SIZE, REELS_PER_ACCOUNT, MAX_POST_AGE_DAYS, DELAY_MIN, DELAY_MAX
from session import get_client
import supabase_client as db

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("sync")


def sleep_a_bit():
    time.sleep(random.uniform(DELAY_MIN, DELAY_MAX))


def post_url_for(media) -> str:
    return f"https://www.instagram.com/reel/{media.code}/"


def sync_account(cl, account: dict) -> int:
    username = account["username"]
    try:
        user_id = cl.user_id_from_username(username)
        sleep_a_bit()
        medias = cl.user_medias(user_id, amount=REELS_PER_ACCOUNT)
        sleep_a_bit()
    except Exception as exc:
        log.warning("@%s 동기화 실패: %s", username, exc)
        db.mark_synced(account["id"])
        return 0

    cutoff = datetime.now(timezone.utc) - timedelta(days=MAX_POST_AGE_DAYS)
    rows = []
    for media in medias:
        taken_at = media.taken_at
        if taken_at is None or taken_at < cutoff:
            continue
        rows.append(
            {
                "category": account["category"],
                "post_url": post_url_for(media),
                "account_handle": username,
                "thumbnail_url": str(media.thumbnail_url) if media.thumbnail_url else None,
                "caption": (media.caption_text or "")[:300] or None,
                "like_count": media.like_count,
                "view_count": media.view_count or media.play_count,
                "comment_count": media.comment_count,
                "posted_at": taken_at.isoformat(),
            }
        )

    db.upsert_trending_reels(rows)
    db.mark_synced(account["id"])
    return len(rows)


def main():
    cl = get_client()
    accounts = db.get_accounts_to_sync(SYNC_BATCH_SIZE)
    log.info("이번 배치 대상 계정 수: %d", len(accounts))

    total = 0
    for account in accounts:
        try:
            total += sync_account(cl, account)
        except Exception as exc:
            log.exception("@%s 처리 중 예상치 못한 오류: %s", account["username"], exc)

    log.info("완료. 이번 배치에서 저장한 릴스 수: %d", total)


if __name__ == "__main__":
    main()
