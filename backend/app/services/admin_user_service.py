from __future__ import annotations

import secrets
from datetime import datetime
from typing import List, Optional, Tuple

from fastapi import HTTPException
from sqlmodel import Session, select, func

from app.core.auth import get_password_hash
from app.models.models import User, ScanLog, DailyLog


def search_users(*, session: Session, q: str, limit: int = 10) -> List[User]:
    q = (q or "").strip()
    if not q:
        return []
    statement = (
        select(User)
        .where(User.email.ilike(f"%{q}%") | (User.name.ilike(f"%{q}%")))
        .order_by(User.created_at.desc())
        .limit(limit)
    )
    return session.exec(statement).all()


def list_users(
    *,
    session: Session,
    status: Optional[str] = None,
    plan: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> Tuple[int, List[User]]:
    page = max(1, page)
    limit = min(max(1, limit), 100)

    where = []
    if status:
        where.append(User.status == status)
    if plan:
        where.append(User.plan == plan)

    total_stmt = select(func.count()).select_from(User)
    if where:
        for cond in where:
            total_stmt = total_stmt.where(cond)
    total = session.exec(total_stmt).one()

    stmt = select(User)
    if where:
        for cond in where:
            stmt = stmt.where(cond)
    stmt = stmt.order_by(User.created_at.desc()).offset((page - 1) * limit).limit(limit)
    users = session.exec(stmt).all()
    return int(total), users


def get_user_profile(*, session: Session, user_id: int):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    scans_count = session.exec(select(func.count()).select_from(ScanLog).where(ScanLog.user_id == user_id)).one()
    meals_logged = session.exec(select(func.count()).select_from(DailyLog).where(DailyLog.user_id == user_id)).one()
    return user, int(scans_count), int(meals_logged)


def ban_user(*, session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = "banned"
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def reset_password(*, session: Session, user_id: int) -> str:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    temp_password = secrets.token_urlsafe(10)
    user.password_hash = get_password_hash(temp_password)
    # Admin-triggered reset counts as a "touch", but keep last_login unchanged.
    session.add(user)
    session.commit()
    return temp_password


def touch_last_login(*, session: Session, user: User) -> None:
    user.last_login = datetime.utcnow()
    session.add(user)
    session.commit()
