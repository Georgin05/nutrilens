import json
from sqlmodel import Session
from app.db.database import engine
from app.models.models import MealTemplate

def seed_meal_templates():
    templates = [
        # Breakfast
        {
            "name": "Classic Oats & Protein",
            "meal_type": "Breakfast",
            "calories": 450,
            "protein_g": 30,
            "carbs_g": 50,
            "fat_g": 12,
            "food_items_json": json.dumps([
                {"name": "Rolled Oats", "quantity": 60, "unit": "g", "category": "Carbs"},
                {"name": "Whey Protein", "quantity": 1, "unit": "scoop", "category": "Protein"},
                {"name": "Milk (Low Fat)", "quantity": 200, "unit": "ml", "category": "Protein"},
                {"name": "Banana", "quantity": 1, "unit": "medium", "category": "Carbs"}
            ]),
            "image_url": "https://images.unsplash.com/photo-1517673400267-0251440c45da?q=80&w=2676&auto=format&fit=crop"
        },
        {
            "name": "Avocado & Egg Toast",
            "meal_type": "Breakfast",
            "calories": 420,
            "protein_g": 18,
            "carbs_g": 35,
            "fat_g": 24,
            "food_items_json": json.dumps([
                {"name": "Whole Grain Bread", "quantity": 2, "unit": "slices", "category": "Carbs"},
                {"name": "Eggs", "quantity": 2, "unit": "large", "category": "Protein"},
                {"name": "Avocado", "quantity": 0.5, "unit": "medium", "category": "Healthy Fats"},
                {"name": "Spinach", "quantity": 30, "unit": "g", "category": "Vegetables"}
            ]),
            "image_url": "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2680&auto=format&fit=crop"
        },
        # Lunch
        {
            "name": "Grilled Chicken & Rice Bowl",
            "meal_type": "Lunch",
            "calories": 650,
            "protein_g": 45,
            "carbs_g": 60,
            "fat_g": 15,
            "food_items_json": json.dumps([
                {"name": "Chicken Breast", "quantity": 200, "unit": "g", "category": "Protein"},
                {"name": "Brown Rice", "quantity": 150, "unit": "g (cooked)", "category": "Carbs"},
                {"name": "Broccoli", "quantity": 100, "unit": "g", "category": "Vegetables"},
                {"name": "Olive Oil", "quantity": 1, "unit": "tbsp", "category": "Healthy Fats"}
            ]),
            "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2680&auto=format&fit=crop"
        },
        # Dinner
        {
            "name": "Baked Salmon & Asparagus",
            "meal_type": "Dinner",
            "calories": 550,
            "protein_g": 35,
            "carbs_g": 15,
            "fat_g": 38,
            "food_items_json": json.dumps([
                {"name": "Salmon Fillet", "quantity": 180, "unit": "g", "category": "Protein"},
                {"name": "Asparagus", "quantity": 150, "unit": "g", "category": "Vegetables"},
                {"name": "Raw Almonds", "quantity": 20, "unit": "g", "category": "Healthy Fats"}
            ]),
            "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2574&auto=format&fit=crop"
        },
        # Snack
        {
            "name": "Greek Yogurt & Berries",
            "meal_type": "Snack",
            "calories": 200,
            "protein_g": 15,
            "carbs_g": 25,
            "fat_g": 4,
            "food_items_json": json.dumps([
                {"name": "Greek Yogurt", "quantity": 150, "unit": "g", "category": "Protein"},
                {"name": "Blueberries", "quantity": 50, "unit": "g", "category": "Carbs"}
            ]),
            "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=2574&auto=format&fit=crop"
        }
    ]
    
    with Session(engine) as session:
        for t_data in templates:
            template = MealTemplate(**t_data)
            session.add(template)
        session.commit()
        print("Meal templates seeded successfully!")

if __name__ == "__main__":
    seed_meal_templates()
