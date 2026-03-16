from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    health_goal: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

from pydantic import ConfigDict

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    health_goal: Optional[str] = None
    bmr: Optional[float] = None
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    age_years: Optional[int] = None
    gender: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    intolerances: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    medical_history: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class UserProfileUpdate(BaseModel):
    weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    age_years: Optional[int] = None
    gender: Optional[str] = None
    health_goal: Optional[str] = None
    diet_type: Optional[str] = None
    allergies: Optional[str] = None
    intolerances: Optional[str] = None
    conditions: Optional[str] = None
    medications: Optional[str] = None
    medical_history: Optional[str] = None

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

# ---- Phase 4 Schemas ----

class ShoppingListCreate(BaseModel):
    item_name: str
    is_healthy_swap: bool = False

class ShoppingListUpdate(BaseModel):
    item_name: Optional[str] = None
    status: Optional[str] = None

class ShoppingListResponse(BaseModel):
    id: int
    user_id: int
    item_name: str
    is_healthy_swap: bool
    status: str
    
    model_config = ConfigDict(from_attributes=True)

# ---- Phase 5 Schemas (Lenses) ----

class CustomLensCreate(BaseModel):
    name: str
    theme_color: str
    calorie_limit: Optional[float] = None
    min_protein_g: Optional[float] = None
    max_sugar_g: Optional[float] = None
    flagged_ingredients: Optional[List[str]] = None

class CustomLensResponse(BaseModel):
    id: int
    user_id: int
    name: str
    theme_color: str
    calorie_limit: Optional[float] = None
    min_protein_g: Optional[float] = None
    max_sugar_g: Optional[float] = None
    flagged_ingredients: Optional[List[str]] = None
    
    model_config = ConfigDict(from_attributes=True)

# ---- Phase 6 Schemas (Smart Cart) ----

class SmartCartCreate(BaseModel):
    duration: str
    diet_lens: str
    budget: float
    people: int

class SmartCartResponse(BaseModel):
    id: int
    user_id: int
    duration: str
    diet_lens: str
    budget: float
    people: int
    cart_json: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
