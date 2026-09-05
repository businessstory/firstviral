from datetime import datetime, timezone

import requests

from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

HEADERS = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}


def _url(path: str) -> str:
    return f"{SUPABASE_URL}/rest/v1/{path}"


def get_state(key: str, default=None):
    res = requests.get(
        _url("scraper_state"),
        headers=HEADERS,
        params={"select": "value", "key": f"eq.{key}"},
        timeout=30,
    )
    res.raise_for_status()
    rows = res.json()
    return rows[0]["value"] if rows else default


def set_state(key: str, value) -> None:
    res = requests.post(
        _url("scraper_state?on_conflict=key"),
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=[{"key": key, "value": value}],
        timeout=30,
    )
    res.raise_for_status()


def count_tracked_accounts(category: str) -> int:
    res = requests.get(
        _url("tracked_accounts"),
        headers={**HEADERS, "Prefer": "count=exact"},
        params={"select": "id", "category": f"eq.{category}"},
        timeout=30,
    )
    res.raise_for_status()
    content_range = res.headers.get("content-range", "*/0")
    return int(content_range.split("/")[-1])


def get_known_usernames(category: str) -> set[str]:
    res = requests.get(
        _url("tracked_accounts"),
        headers=HEADERS,
        params={"select": "username", "category": f"eq.{category}"},
        timeout=30,
    )
    res.raise_for_status()
    return {row["username"] for row in res.json()}


def upsert_tracked_accounts(rows: list[dict]) -> None:
    if not rows:
        return
    res = requests.post(
        _url("tracked_accounts?on_conflict=username"),
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=rows,
        timeout=30,
    )
    res.raise_for_status()


def get_accounts_to_sync(batch_size: int) -> list[dict]:
    res = requests.get(
        _url("tracked_accounts"),
        headers=HEADERS,
        params={
            "select": "id,category,username",
            "order": "last_synced_at.asc.nullsfirst",
            "limit": str(batch_size),
        },
        timeout=30,
    )
    res.raise_for_status()
    return res.json()


def mark_synced(account_id: str) -> None:
    res = requests.patch(
        _url(f"tracked_accounts?id=eq.{account_id}"),
        headers={**HEADERS, "Prefer": "return=minimal"},
        json={"last_synced_at": datetime.now(timezone.utc).isoformat()},
        timeout=30,
    )
    res.raise_for_status()


def upsert_trending_reels(rows: list[dict]) -> None:
    if not rows:
        return
    res = requests.post(
        _url("trending_reels?on_conflict=post_url"),
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=rows,
        timeout=30,
    )
    res.raise_for_status()
