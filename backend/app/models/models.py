from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    health_goal: Optional[str] = None
    bmr: Optional[float] = None

class Product(SQLModel, table=True):
    barcode: str = Field(primary_key=True)
    name: str
    ingredients: Optional[str] = None
    nutri_score: Optional[str] = None
    processed_level: Optional[int] = None # Assuming NOVA score 1-4

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
