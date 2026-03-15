from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime


class AdminUserSummary(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    status: str
    plan: str

    model_config = ConfigDict(from_attributes=True)


class AdminUserProfile(BaseModel):
    id: int
    name: Optional[str] = None
    email: EmailStr
    plan: str
    status: str
    joined_date: datetime
    last_login: Optional[datetime] = None
    scans_count: int
    meals_logged: int


class AdminActivityItem(BaseModel):
    action: str
    target: str
    time: datetime
    metadata: Optional[Dict[str, Any]] = None


class AdminScanCategoriesResponse(BaseModel):
    categories: Dict[str, int]


class AdminResetPasswordResponse(BaseModel):
    user_id: int
    temporary_password: str


class AdminMessageRequest(BaseModel):
    message: str


class AdminMessageResponse(BaseModel):
    status: str


class AdminUsersListResponse(BaseModel):
    page: int
    limit: int
    total: int
    users: List[AdminUserSummary]
