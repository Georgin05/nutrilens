from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

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

# ---- Phase 3 Schemas ----

class DailyLogCreate(BaseModel):
    barcode: str
    serving_size: float

class DailyLogResponse(BaseModel):
    id: int
    user_id: int
    barcode: str
    product_name: str
    serving_size: float
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DailySummaryResponse(BaseModel):
    date: str
    total_calories: float
    total_protein_g: float
    total_carbs_g: float
    total_fat_g: float
    logs: List[DailyLogResponse]
