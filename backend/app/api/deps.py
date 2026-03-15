from fastapi import Depends, HTTPException, Header, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
import jwt
from pydantic import ValidationError
from typing import Optional

from app.core.config import settings
from app.db.database import get_session
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="users/login", auto_error=False)

def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

def get_optional_user(
    session: Session = Depends(get_session),
    token: Optional[str] = Depends(oauth2_scheme_optional),
) -> Optional[User]:
    """
    Returns a user if the Authorization header is present and valid; otherwise None.
    Useful for endpoints that can be used anonymously but should attach telemetry when authenticated.
    """
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: Optional[str] = payload.get("sub")
        if not user_id:
            return None
    except (jwt.PyJWTError, ValidationError):
        return None

    return session.get(User, int(user_id))

def require_admin_key(x_admin_key: Optional[str] = Header(default=None, alias="X-Admin-Key")):
    """Verifies `X-Admin-Key` when `ADMIN_API_KEY` is set."""
    # If no key is configured, leave admin endpoints open for local/dev.
    if not settings.ADMIN_API_KEY:
        return True
    if x_admin_key != settings.ADMIN_API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid admin key")
    return True
