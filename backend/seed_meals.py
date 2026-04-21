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
            "food_items_json": json.dumps([
                {"name": "Oats", "quantity": 50, "unit": "g", "category": "Carbs"},
                {"name": "Peanut Butter", "quantity": 1, "unit": "tbsp", "category": "Healthy Fats"},
                {"name": "Banana", "quantity": 1, "unit": "piece", "category": "Other"},
                {"name": "Curd/Yogurt", "quantity": 100, "unit": "g", "category": "Protein"}
            ]),
            "calories": 520, "protein_g": 22, "carbs_g": 75, "fat_g": 23,
            "tags_json": json.dumps(["high-carb", "vegetarian"]),
            "estimated_cost": 85.0
        },
        {
            "name": "PB Bread + Yogurt",
            "meal_type": "Breakfast",
            "food_items_json": json.dumps([
                {"name": "Whole Wheat Bread", "quantity": 2, "unit": "slice", "category": "Carbs"},
                {"name": "Peanut Butter", "quantity": 1, "unit": "tbsp", "category": "Healthy Fats"},
                {"name": "Curd/Yogurt", "quantity": 150, "unit": "g", "category": "Protein"}
            ]),
            "calories": 450, "protein_g": 23, "carbs_g": 41, "fat_g": 21,
            "tags_json": json.dumps(["quick", "vegetarian"]),
            "estimated_cost": 65.0
        },
        # Lunch
        {
            "name": "Grilled Chicken + Rice + Veggies",
            "meal_type": "Lunch",
            "food_items_json": json.dumps([
                {"name": "Chicken Breast", "quantity": 200, "unit": "g", "category": "Protein"},
                {"name": "Rice", "quantity": 150, "unit": "g", "category": "Carbs"},
                {"name": "Broccoli", "quantity": 100, "unit": "g", "category": "Vegetables"},
                {"name": "Bell Pepper", "quantity": 1, "unit": "piece", "category": "Vegetables"}
            ]),
            "calories": 620, "protein_g": 48, "carbs_g": 60, "fat_g": 7,
            "tags_json": json.dumps(["high-protein", "low-fat"]),
            "estimated_cost": 180.0
        },
        {
            "name": "Chicken + Roti + Salad",
            "meal_type": "Lunch",
            "food_items_json": json.dumps([
                {"name": "Chicken Breast", "quantity": 200, "unit": "g", "category": "Protein"},
                {"name": "Roti/Chapati", "quantity": 3, "unit": "piece", "category": "Carbs"},
                {"name": "Cucumber", "quantity": 100, "unit": "g", "category": "Vegetables"},
                {"name": "Tomato", "quantity": 1, "unit": "piece", "category": "Vegetables"}
            ]),
            "calories": 580, "protein_g": 44, "carbs_g": 45, "fat_g": 10,
            "tags_json": json.dumps(["high-protein", "balanced"]),
            "estimated_cost": 160.0
        },
        # Dinner
        {
            "name": "Baked Fish + Roti + Salad",
            "meal_type": "Dinner",
            "food_items_json": json.dumps([
                {"name": "Fish (Rohu)", "quantity": 200, "unit": "g", "category": "Protein"},
                {"name": "Roti/Chapati", "quantity": 2, "unit": "piece", "category": "Carbs"},
                {"name": "Lettuce", "quantity": 50, "unit": "g", "category": "Vegetables"},
                {"name": "Cucumber", "quantity": 50, "unit": "g", "category": "Vegetables"}
            ]),
            "calories": 450, "protein_g": 38, "carbs_g": 25, "fat_g": 8,
            "tags_json": json.dumps(["high-protein", "low-carb", "pescatarian"]),
            "estimated_cost": 150.0
        },
        {
            "name": "Baked Fish + Rice + Veggies",
            "meal_type": "Dinner",
            "food_items_json": json.dumps([
                {"name": "Fish (Rohu)", "quantity": 200, "unit": "g", "category": "Protein"},
                {"name": "Rice", "quantity": 150, "unit": "g", "category": "Carbs"},
                {"name": "Green Beans", "quantity": 100, "unit": "g", "category": "Vegetables"},
                {"name": "Carrot", "quantity": 1, "unit": "piece", "category": "Vegetables"}
            ]),
            "calories": 550, "protein_g": 42, "carbs_g": 50, "fat_g": 8,
            "tags_json": json.dumps(["high-protein", "pescatarian"]),
            "estimated_cost": 170.0
        },
        # Snack
        {
            "name": "PB Bread + Apple",
            "meal_type": "Snack",
            "food_items_json": json.dumps([
                {"name": "Whole Wheat Bread", "quantity": 2, "unit": "slice", "category": "Carbs"},
                {"name": "Peanut Butter", "quantity": 1, "unit": "tbsp", "category": "Healthy Fats"},
                {"name": "Apple", "quantity": 1, "unit": "piece", "category": "Other"}
            ]),
            "calories": 425, "protein_g": 13, "carbs_g": 56, "fat_g": 18,
            "tags_json": json.dumps(["quick", "vegetarian"]),
            "estimated_cost": 55.0
        },
        # Supplement
        {
            "name": "Protein Shake",
            "meal_type": "Supplement",
            "food_items_json": json.dumps([
                {"name": "Milk", "quantity": 300, "unit": "ml", "category": "Protein"},
                {"name": "Oats", "quantity": 50, "unit": "g", "category": "Carbs"},
                {"name": "Peanut Butter", "quantity": 1, "unit": "tbsp", "category": "Healthy Fats"},
                {"name": "Banana", "quantity": 1, "unit": "piece", "category": "Other"}
            ]),
            "calories": 450, "protein_g": 22, "carbs_g": 75, "fat_g": 23,
            "tags_json": json.dumps(["high-protein", "quick", "vegetarian"]),
            "estimated_cost": 75.0
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
