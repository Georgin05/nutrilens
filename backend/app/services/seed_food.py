from sqlmodel import Session, select
from app.db.database import engine
from app.models.models import Food

def seed_foods():
    foods = [
        # Protein
        {"name": "Chicken Breast (100g)", "calories": 165, "protein": 31, "carbs": 0, "fat": 3.6, "sugar": 0},
        {"name": "Salmon (100g)", "calories": 208, "protein": 20, "carbs": 0, "fat": 13, "sugar": 0},
        {"name": "Eggs (1 large)", "calories": 78, "protein": 6, "carbs": 0.6, "fat": 5, "sugar": 0.6},
        {"name": "Greek Yogurt (100g)", "calories": 59, "protein": 10, "carbs": 3.6, "fat": 0.4, "sugar": 3.2},
        {"name": "Tofu (100g)", "calories": 76, "protein": 8, "carbs": 1.9, "fat": 4.8, "sugar": 0},
        {"name": "Beef Steak (100g)", "calories": 250, "protein": 26, "carbs": 0, "fat": 15, "sugar": 0},
        
        # Carbs
        {"name": "Brown Rice (100g cooked)", "calories": 111, "protein": 2.6, "carbs": 23, "fat": 0.9, "sugar": 0.4},
        {"name": "Oats (100g dry)", "calories": 389, "protein": 16.9, "carbs": 66, "fat": 6.9, "sugar": 0},
        {"name": "Sweet Potato (100g)", "calories": 86, "protein": 1.6, "carbs": 20, "fat": 0.1, "sugar": 4.2},
        {"name": "Quinoa (100g cooked)", "calories": 120, "protein": 4.4, "carbs": 21, "fat": 1.9, "sugar": 0},
        {"name": "Whole Wheat Bread (1 slice)", "calories": 69, "protein": 3.6, "carbs": 12, "fat": 0.9, "sugar": 1.4},
        
        # Fats
        {"name": "Avocado (100g)", "calories": 160, "protein": 2, "carbs": 8.5, "fat": 15, "sugar": 0.7},
        {"name": "Almonds (28g)", "calories": 164, "protein": 6, "carbs": 6, "fat": 14, "sugar": 1.2},
        {"name": "Olive Oil (1 tbsp)", "calories": 119, "protein": 0, "carbs": 0, "fat": 13.5, "sugar": 0},
        {"name": "Peanut Butter (1 tbsp)", "calories": 94, "protein": 4, "carbs": 3, "fat": 8, "sugar": 1},
        
        # Fruits/Veg
        {"name": "Banana (1 medium)", "calories": 105, "protein": 1.3, "carbs": 27, "fat": 0.4, "sugar": 14},
        {"name": "Apple (1 medium)", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3, "sugar": 19},
        {"name": "Broccoli (100g)", "calories": 34, "protein": 2.8, "carbs": 6.6, "fat": 0.4, "sugar": 1.7},
        {"name": "Spinach (100g)", "calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4, "sugar": 0.4},
        {"name": "Blueberries (100g)", "calories": 57, "protein": 0.7, "carbs": 14, "fat": 0.3, "sugar": 10},
    ]
    
    with Session(engine) as session:
        for f in foods:
            statement = select(Food).where(Food.name == f["name"])
            existing = session.exec(statement).first()
            if not existing:
                food_obj = Food(**f)
                session.add(food_obj)
        session.commit()
        print(f"Successfully seeded {len(foods)} MVP foods.")

if __name__ == "__main__":
    seed_foods()
