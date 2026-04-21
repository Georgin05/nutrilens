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
    activity_level: Optional[float] = Field(default=1.2) # Multiplier: 1.2 (Sedentary) to 1.9 (Very Active)
    active_lens_id: Optional[int] = Field(default=None, foreign_key="custom_lenses.id")

class UserNutritionProfile(SQLModel, table=True):
    __tablename__ = "user_nutrition_profile"
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    bmr: float
    tdee: float
    last_calculated: datetime = Field(default_factory=datetime.utcnow)

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
    barcode: Optional[str] = Field(default=None, foreign_key="product.barcode")
    product_name: Optional[str] = None # For custom logs or meal templates
    serving_size: float = Field(default=1.0)
    calories: float = Field(default=0.0)
    protein_g: float = Field(default=0.0)
    carbs_g: float = Field(default=0.0)
    fat_g: float = Field(default=0.0)
    meal_type: Optional[str] = None # 'Breakfast', 'Lunch', etc.
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ShoppingList(SQLModel, table=True):
    __tablename__ = "shopping_list"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    item_name: str
    category: str = Field(default="Other") # e.g. "Vegetables", "Protein", "Carbs", "Healthy Fats"
    quantity: float = Field(default=1.0)
    unit: str = Field(default="unit")
    is_healthy_swap: bool = Field(default=False)
    price: Optional[float] = Field(default=0.0)
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
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    is_system: bool = Field(default=False)
    icon: str = Field(default="visibility") # Material Symbol name
    name: str
    theme_color: str
    calorie_modifier: float = Field(default=0.0) # e.g. -400, +400
    protein_ratio: float = Field(default=0.3)
    carb_ratio: float = Field(default=0.4)
    fat_ratio: float = Field(default=0.3)
    sugar_limit_g: Optional[float] = None
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

class MealTemplate(SQLModel, table=True):
    __tablename__ = "meal_templates"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    name: str
    meal_type: str # 'Breakfast', 'Lunch', 'Dinner', 'Snack'
    food_items_json: str # JSON list of items
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    image_url: Optional[str] = None
    tags_json: str = Field(default="[]")
    estimated_cost: float = Field(default=0.0)
    
    plans: List["MealPlan"] = Relationship(back_populates="meal_template")

class IngredientPrice(SQLModel, table=True):
    __tablename__ = "ingredient_prices"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    price: float
    unit: str = Field(default="unit") # e.g. "kg", "pack", "item"
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class AIChatHistory(SQLModel, table=True):
    __tablename__ = "ai_chat_history"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    role: str # 'user' or 'ai'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class MealPlan(SQLModel, table=True):
    __tablename__ = "meal_plans"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    day_of_week: str # 'Monday', 'Tuesday', etc.
    meal_type: str # 'Breakfast', 'Lunch', 'Dinner', 'Snack'
    meal_template_id: int = Field(foreign_key="meal_templates.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    meal_template: Optional[MealTemplate] = Relationship(back_populates="plans")
