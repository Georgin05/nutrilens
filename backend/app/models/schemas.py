from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

from pydantic import ConfigDict

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    health_goal: Optional[str] = None
    bmr: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfileUpdate(BaseModel):
    weight_kg: float
    height_cm: float
    age_years: int
    gender: str # 'male' or 'female'
    health_goal: Optional[str] = None
