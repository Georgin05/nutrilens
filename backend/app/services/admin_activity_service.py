from __future__ import annotations

import json
from typing import Any, Dict, Optional, List

from sqlmodel import Session, select

from app.models.models import ActivityLog


def log_activity(
    *,
    session: Session,
    user_id: int,
    action: str,
    target: str,
    metadata: Optional[Dict[str, Any]] = None,
    commit: bool = True,
) -> ActivityLog:
    entry = ActivityLog(
        user_id=user_id,
        action=action,
        target=target,
        metadata_json=json.dumps(metadata, separators=(",", ":"), ensure_ascii=True) if metadata else None,
    )
    session.add(entry)
    if commit:
        session.commit()
        session.refresh(entry)
    return entry


def get_user_activity(*, session: Session, user_id: int, limit: int = 50) -> List[ActivityLog]:
    statement = (
        select(ActivityLog)
        .where(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
    )
    return session.exec(statement).all()
