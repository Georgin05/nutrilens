from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
from sqlmodel import Session, select
import jwt
from pydantic import ValidationError

from app.core.config import settings
from app.db.database import get_session
from app.models.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login", auto_error=False)

def get_current_user(
    session: Session = Depends(get_session),
    token: Optional[str] = Depends(oauth2_scheme)
) -> User:
    # MVP BYPASS: If no token is provided or validation fails, fallback to User 1
    # This allows the system to function during development without a login flow.
    user_id = None
    try:
        if token and token != "undefined":
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user_id = payload.get("sub")
    except (jwt.PyJWTError, ValidationError):
        pass

    if user_id:
        user = session.get(User, int(user_id))
        if user:
            return user

    # Fallback to the first user in the system
    fallback_user = session.exec(select(User)).first()
    if fallback_user:
        return fallback_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No users found and no valid credentials provided.",
    )

