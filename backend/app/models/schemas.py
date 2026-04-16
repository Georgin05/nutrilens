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
    activity_level: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)

class UserNutritionProfileResponse(BaseModel):
    user_id: int
    bmr: float
    tdee: float
    last_calculated: datetime

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
    activity_level: Optional[float] = None

# ---- Phase 3 Schemas ----

class DailyLogCreate(BaseModel):
    barcode: Optional[str] = None
    product_name: Optional[str] = None
    serving_size: float = 1.0
    calories: Optional[float] = 0.0
    protein_g: Optional[float] = 0.0
    carbs_g: Optional[float] = 0.0
    fat_g: Optional[float] = 0.0
    meal_type: Optional[str] = None

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
    meal_type: Optional[str] = None
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
    category: str = "Other"
    quantity: float = 1.0
    unit: str = "unit"
    is_healthy_swap: bool = False
    price: float = 0.0

class ShoppingListUpdate(BaseModel):
    item_name: Optional[str] = None
    status: Optional[str] = None
    quantity: Optional[float] = None
    category: Optional[str] = None

class ShoppingListResponse(BaseModel):
    id: int
    user_id: int
    item_name: str
    category: str
    quantity: float
    unit: str
    is_healthy_swap: bool
    price: float
    status: str
    
    model_config = ConfigDict(from_attributes=True)

# ---- Phase 5 Schemas (Lenses) ----

class CustomLensCreate(BaseModel):
    name: str
    theme_color: str
    calorie_modifier: float = 0.0
    protein_ratio: float = 0.3
    carb_ratio: float = 0.4
    fat_ratio: float = 0.3
    sugar_limit_g: Optional[float] = None
    flagged_ingredients: Optional[List[str]] = None

class CustomLensResponse(BaseModel):
    id: int
    user_id: int
    name: str
    theme_color: str
    calorie_modifier: float
    protein_ratio: float
    carb_ratio: float
    fat_ratio: float
    sugar_limit_g: Optional[float] = None
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
# ---- Phase 7 Schemas (Meals) ----

class MealTemplateResponse(BaseModel):
    id: int
    name: str
    meal_type: str
    food_items_json: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    image_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class MealPlanCreate(BaseModel):
    day_of_week: str
    meal_type: str
    meal_template_id: int

class MealPlanResponse(BaseModel):
    id: int
    user_id: int
    day_of_week: str
    meal_type: str
    meal_template_id: int
    created_at: datetime
    meal_template: Optional[MealTemplateResponse] = None
    
    model_config = ConfigDict(from_attributes=True)
