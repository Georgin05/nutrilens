from __future__ import annotations

from typing import Dict

from sqlmodel import Session, select, func

from app.models.models import ScanLog


def top_scan_categories(*, session: Session, limit: int = 20) -> Dict[str, int]:
    """
    Returns {category: count} ordered by count desc.
    """
    stmt = (
        select(ScanLog.category, func.count())
        .where(ScanLog.category.is_not(None))
        .group_by(ScanLog.category)
        .order_by(func.count().desc())
        .limit(limit)
    )
    rows = session.exec(stmt).all()
    return {cat: int(count) for cat, count in rows if cat}
