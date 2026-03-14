from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta

from app.db.database import get_session
from app.models.models import User
from app.models.schemas import UserCreate, UserLogin, UserResponse, Token, UserProfileUpdate
from app.core.auth import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user
from app.services.calculator import calculate_bmr

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, session: Session = Depends(get_session)):
    # Check if user already exists
    statement = select(User).where(User.email == user_in.email)
    user = session.exec(statement).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_in.password)
    new_user = User(email=user_in.email, password_hash=hashed_password)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, session: Session = Depends(get_session)):
    # Authenticate user
    statement = select(User).where(User.email == user_in.email)
    user = session.exec(statement).first()
    
    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me/profile", response_model=UserResponse)
def update_user_profile(
    profile_in: UserProfileUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Calculate BMR based on Harris-Benedict if all required fields are present
    if (profile_in.weight_kg is not None and 
        profile_in.height_cm is not None and 
        profile_in.age_years is not None and 
        profile_in.gender is not None):
        try:
            bmr = calculate_bmr(
                weight_kg=profile_in.weight_kg,
                height_cm=profile_in.height_cm,
                age_years=profile_in.age_years,
                gender=profile_in.gender
            )
            current_user.bmr = bmr
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    # Update other fields dynamically
    update_data = profile_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user
    
    return current_user
