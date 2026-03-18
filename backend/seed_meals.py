import json
from sqlmodel import Session
from app.db.database import engine
from app.models.models import MealTemplate

def seed():
    templates = [
        # Breakfast
        {
            "name": "Oats + PB + Banana + Yogurt",
            "meal_type": "Breakfast",
            "food_items_json": json.dumps(["Oats (50g)", "Peanut Butter", "Banana", "Yogurt"]),
            "calories": 520, "protein_g": 22, "carbs_g": 75, "fat_g": 23
        },
        {
            "name": "PB Bread + Yogurt",
            "meal_type": "Breakfast",
            "food_items_json": json.dumps(["Bread", "Peanut Butter", "Yogurt"]),
            "calories": 450, "protein_g": 23, "carbs_g": 41, "fat_g": 21
        },
        # Lunch
        {
            "name": "Grilled Chicken + Rice + Veggies",
            "meal_type": "Lunch",
            "food_items_json": json.dumps(["Chicken Breast", "Rice", "Vegetables"]),
            "calories": 620, "protein_g": 48, "carbs_g": 60, "fat_g": 7
        },
        {
            "name": "Chicken + Roti + Salad",
            "meal_type": "Lunch",
            "food_items_json": json.dumps(["Chicken Breast", "Roti", "Salad"]),
            "calories": 580, "protein_g": 44, "carbs_g": 45, "fat_g": 10
        },
        # Dinner
        {
            "name": "Baked Fish + Roti + Salad",
            "meal_type": "Dinner",
            "food_items_json": json.dumps(["Fish", "Roti", "Salad"]),
            "calories": 450, "protein_g": 38, "carbs_g": 25, "fat_g": 8
        },
        {
            "name": "Baked Fish + Rice + Veggies",
            "meal_type": "Dinner",
            "food_items_json": json.dumps(["Fish", "Rice", "Vegetables"]),
            "calories": 550, "protein_g": 42, "carbs_g": 50, "fat_g": 8
        },
        # Snack
        {
            "name": "PB Bread + Apple",
            "meal_type": "Snack",
            "food_items_json": json.dumps(["Bread", "Peanut Butter", "Apple"]),
            "calories": 425, "protein_g": 13, "carbs_g": 56, "fat_g": 18
        },
        # Supplement
        {
            "name": "Protein Shake",
            "meal_type": "Supplement",
            "food_items_json": json.dumps(["Milk", "Oats (50g)", "Peanut Butter", "Banana"]),
            "calories": 450, "protein_g": 22, "carbs_g": 75, "fat_g": 23
        }
    ]

    with Session(engine) as session:
        for t_data in templates:
            # Check if template already exists
            existing = session.query(MealTemplate).filter(MealTemplate.name == t_data["name"]).first()
            if not existing:
                template = MealTemplate(**t_data)
                session.add(template)
        session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    seed()
