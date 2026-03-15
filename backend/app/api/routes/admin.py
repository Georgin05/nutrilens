from __future__ import annotations

import json
from typing import Optional, List

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.api.deps import require_admin_key
from app.db.database import get_session
from app.models.admin_schemas import (
    AdminActivityItem,
    AdminMessageRequest,
    AdminMessageResponse,
    AdminResetPasswordResponse,
    AdminScanCategoriesResponse,
    AdminUserProfile,
    AdminUserSummary,
    AdminUsersListResponse,
)
from app.services import admin_activity_service
from app.services import admin_analytics_service
from app.services import admin_user_service

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin_key)])


@router.get("/users/search", response_model=List[AdminUserSummary])
def admin_user_search(
    q: str,
    session: Session = Depends(get_session),
):
    users = admin_user_service.search_users(session=session, q=q)
    return users


@router.get("/users", response_model=AdminUsersListResponse)
def admin_users_list(
    status: Optional[str] = None,
    plan: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    session: Session = Depends(get_session),
):
    total, users = admin_user_service.list_users(session=session, status=status, plan=plan, page=page, limit=limit)
    return {"page": max(1, page), "limit": min(max(1, limit), 100), "total": total, "users": users}


@router.get("/users/{user_id}", response_model=AdminUserProfile)
def admin_get_user_profile(user_id: int, session: Session = Depends(get_session)):
    user, scans_count, meals_logged = admin_user_service.get_user_profile(session=session, user_id=user_id)
    return AdminUserProfile(
        id=user.id,
        name=user.name,
        email=user.email,
        plan=user.plan,
        status=user.status,
        joined_date=user.created_at,
        last_login=user.last_login,
        scans_count=scans_count,
        meals_logged=meals_logged,
    )


@router.get("/users/{user_id}/activity", response_model=List[AdminActivityItem])
def admin_user_activity(user_id: int, limit: int = 50, session: Session = Depends(get_session)):
    items = admin_activity_service.get_user_activity(session=session, user_id=user_id, limit=min(max(1, limit), 200))
    out: List[AdminActivityItem] = []
    for it in items:
        out.append(
            AdminActivityItem(
                action=it.action,
                target=it.target,
                time=it.created_at,
                metadata=json.loads(it.metadata_json) if it.metadata_json else None,
            )
        )
    return out


@router.get("/analytics/scan-categories", response_model=AdminScanCategoriesResponse)
def admin_scan_categories(session: Session = Depends(get_session)):
    categories = admin_analytics_service.top_scan_categories(session=session)
    return {"categories": categories}


@router.post("/users/{user_id}/ban", status_code=status.HTTP_200_OK)
def admin_ban_user(user_id: int, session: Session = Depends(get_session)):
    user = admin_user_service.ban_user(session=session, user_id=user_id)
    admin_activity_service.log_activity(
        session=session,
        user_id=user.id,
        action="admin_ban",
        target="user",
        metadata={"status": user.status},
    )
    return {"status": "banned", "user_id": user.id}


@router.post("/users/{user_id}/reset-password", response_model=AdminResetPasswordResponse)
def admin_reset_password(user_id: int, session: Session = Depends(get_session)):
    temp_password = admin_user_service.reset_password(session=session, user_id=user_id)
    admin_activity_service.log_activity(
        session=session,
        user_id=user_id,
        action="admin_reset_password",
        target="user",
        metadata=None,
    )
    return {"user_id": user_id, "temporary_password": temp_password}


@router.post("/users/{user_id}/message", response_model=AdminMessageResponse)
def admin_send_message(user_id: int, payload: AdminMessageRequest, session: Session = Depends(get_session)):
    admin_activity_service.log_activity(
        session=session,
        user_id=user_id,
        action="admin_message",
        target="user",
        metadata={"message": payload.message},
    )
    return {"status": "queued"}
