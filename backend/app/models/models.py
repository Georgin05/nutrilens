from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
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

class Product(SQLModel, table=True):
    barcode: str = Field(primary_key=True)
    name: str
    ingredients: Optional[str] = None
    nutri_score: Optional[str] = None
    processed_level: Optional[int] = None # Assuming NOVA score 1-4
    calories: Optional[float] = None
    protein_g: Optional[float] = None
    carbs_g: Optional[float] = None
    fat_g: Optional[float] = None

class DailyLog(SQLModel, table=True):
    __tablename__ = "daily_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    barcode: str = Field(foreign_key="product.barcode")
    serving_size: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ShoppingList(SQLModel, table=True):
    __tablename__ = "shopping_list"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    item_name: str
    is_healthy_swap: bool = Field(default=False)
    status: str = Field(default="pending") # e.g. "pending", "bought"

class ScanLog(SQLModel, table=True):
    __tablename__ = "scan_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    barcode: str
    product_name: str
    scan_time: datetime = Field(default_factory=datetime.utcnow)

class CustomLens(SQLModel, table=True):
    __tablename__ = "custom_lenses"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    name: str
    theme_color: str
    calorie_limit: Optional[float] = None
    min_protein_g: Optional[float] = None
    max_sugar_g: Optional[float] = None
    flagged_ingredients_json: Optional[str] = None # Store as JSON list string

class SmartCart(SQLModel, table=True):
    __tablename__ = "smart_carts"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    duration: str # 'Weekly' or 'Monthly'
    diet_lens: str
    budget: float
    people: int
    cart_json: str # The fully generated cart (items, coverage, swaps) stored as a JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
