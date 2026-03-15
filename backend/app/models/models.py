from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
import json

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None
    email: str = Field(unique=True, index=True)
    password_hash: str
    plan: str = Field(default="free", index=True)
    status: str = Field(default="active", index=True)  # active|banned|deleted
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    last_login: Optional[datetime] = Field(default=None, index=True)
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
    brand: Optional[str] = None
    ingredients: Optional[str] = None
    nutri_score: Optional[str] = None
    processed_level: Optional[int] = None # Assuming NOVA score 1-4
    # Open Food Facts category tags (stored as JSON string, e.g. ["en:snacks","en:sweets"]).
    categories_json: Optional[str] = None
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
    category: Optional[str] = Field(default=None, index=True)
    nutrition_score: Optional[str] = Field(default=None, index=True)
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

class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_logs"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    action: str = Field(index=True)  # scan|consume|smart_cart|admin_message|...
    target: str = Field(index=True)  # e.g. barcode, product_name, "smart_cart"
    metadata_json: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)

def safe_json_dumps(value) -> str:
    # Keep JSON serialization consistent for metadata_json / categories_json.
    return json.dumps(value, separators=(",", ":"), ensure_ascii=True)
