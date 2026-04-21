import sys
import os

# Ensure the backend directory is in the path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from datetime import datetime, timedelta
from app.db.database import engine, create_db_and_tables
from app.models.models import User, Product, DailyLog, MealTemplate, CustomLens, UserNutritionProfile
from app.core.auth import get_password_hash
import json

def seed_db():
    print("Initializing Database...")
    create_db_and_tables()
    with Session(engine) as session:
        # 1. Create Test User
        user = session.exec(select(User).where(User.email == "test@example.com")).first()
        if not user:
            print("Creating test@example.com user...")
            user = User(
                email="test@example.com",
                password_hash=get_password_hash("password"),
                weight_kg=75.0,
                height_cm=180.0,
                age_years=25,
                gender="Male",
                activity_level=1.375,
                health_goal="Muscle Gain"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        
        # 2. Add a default Lens
        lens = session.exec(select(CustomLens).where(CustomLens.name == "Balanced")).first()
        if not lens:
            lens = CustomLens(
                user_id=user.id,
                name="Balanced",
                theme_color="#13ec80",
                calorie_modifier=0,
                protein_ratio=0.3,
                carb_ratio=0.4,
                fat_ratio=0.3
            )
            session.add(lens)
            session.commit()
            session.refresh(lens)
            user.active_lens_id = lens.id
            session.add(user)
            session.commit()

        # 3. Create Sample Products
        # (Existing product logic remains)
        p1 = session.get(Product, "000000000001")
        if not p1:
            p1 = Product(barcode="000000000001", name="Whole Wheat Bread", calories=180, protein_g=8, carbs_g=30, fat_g=2)
            session.add(p1)
        
        # 4. Create Meal Templates
        templates = [
            {
                "name": "High Protein Breakfast",
                "meal_type": "Breakfast",
                "food_items_json": json.dumps([{"name": "Oats", "qty": 50}, {"name": "Eggs", "qty": 2}]),
                "calories": 450,
                "protein_g": 30,
                "carbs_g": 50,
                "fat_g": 10,
                "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200"
            },
            {
                "name": "Salmon Quinoa Bowl",
                "meal_type": "Lunch",
                "food_items_json": json.dumps([{"name": "Salmon", "qty": 150}, {"name": "Quinoa", "qty": 100}]),
                "calories": 700,
                "protein_g": 45,
                "carbs_g": 60,
                "fat_g": 25,
                "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=200"
            },
            {
                "name": "Herb Roasted Chicken",
                "meal_type": "Dinner",
                "food_items_json": json.dumps([{"name": "Chicken Breast", "qty": 200}, {"name": "Sweet Potato", "qty": 150}]),
                "calories": 650,
                "protein_g": 50,
                "carbs_g": 40,
                "fat_g": 15,
                "image_url": "https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&q=80&w=200"
            },
            {
                "name": "Greek Yogurt with Berries",
                "meal_type": "Snack",
                "food_items_json": json.dumps([{"name": "Yogurt", "qty": 200}, {"name": "Mixed Berries", "qty": 50}]),
                "calories": 250,
                "protein_g": 20,
                "carbs_g": 25,
                "fat_g": 5,
                "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200"
            }
        ]
        
        for t_data in templates:
            existing_t = session.exec(select(MealTemplate).where(MealTemplate.name == t_data["name"])).first()
            if not existing_t:
                session.add(MealTemplate(**t_data))
        
        session.commit()
        print("Successfully seeded DB with Meal Templates!")

if __name__ == "__main__":
    seed_db()
