from sqlmodel import Session
from app.db.database import engine
from app.models.models import Product

def seed_foods():
    # Core MVP Food Library (Phase 3)
    foods = [
        # Proteins
        {"barcode": "PROT001", "name": "Chicken Breast (100g)", "calories": 165, "protein_g": 31, "carbs_g": 0, "fat_g": 3.6},
        {"barcode": "PROT002", "name": "Salmon Fillet (100g)", "calories": 208, "protein_g": 20, "carbs_g": 0, "fat_g": 13},
        {"barcode": "PROT003", "name": "Large Egg (1 unit)", "calories": 70, "protein_g": 6, "carbs_g": 0.6, "fat_g": 5},
        {"barcode": "PROT004", "name": "Greek Yogurt (100g)", "calories": 59, "protein_g": 10, "carbs_g": 3.6, "fat_g": 0.4},
        {"barcode": "PROT005", "name": "Tofu (100g)", "calories": 76, "protein_g": 8, "carbs_g": 1.9, "fat_g": 4.8},
        
        # Carbs
        {"barcode": "CARB001", "name": "Brown Rice (100g cooked)", "calories": 111, "protein_g": 2.6, "carbs_g": 23, "fat_g": 0.9},
        {"barcode": "CARB002", "name": "Sweet Potato (100g)", "calories": 86, "protein_g": 1.6, "carbs_g": 20, "fat_g": 0.1},
        {"barcode": "CARB003", "name": "Quinoa (100g cooked)", "calories": 120, "protein_g": 4.4, "carbs_g": 21, "fat_g": 1.9},
        {"barcode": "CARB004", "name": "Oatmeal (100g cooked)", "calories": 68, "protein_g": 2.4, "carbs_g": 12, "fat_g": 1.4},
        {"barcode": "CARB005", "name": "Banana (1 average)", "calories": 105, "protein_g": 1.3, "carbs_g": 27, "fat_g": 0.4},

        # Fats
        {"barcode": "FAT001", "name": "Avocado (100g)", "calories": 160, "protein_g": 2, "carbs_g": 8.5, "fat_g": 15},
        {"barcode": "FAT002", "name": "Almonds (28g/Handful)", "calories": 164, "protein_g": 6, "carbs_g": 6, "fat_g": 14},
        {"barcode": "FAT003", "name": "Olive Oil (1 tbsp)", "calories": 119, "protein_g": 0, "carbs_g": 0, "fat_g": 14},
        {"barcode": "FAT004", "name": "Peanut Butter (1 tbsp)", "calories": 94, "protein_g": 4, "carbs_g": 3, "fat_g": 8},

        # Mixed / Veggies
        {"barcode": "VEG001", "name": "Broccoli (100g)", "calories": 34, "protein_g": 2.8, "carbs_g": 7, "fat_g": 0.4},
        {"barcode": "VEG002", "name": "Spinach (100g)", "calories": 23, "protein_g": 2.9, "carbs_g": 3.6, "fat_g": 0.4},
        {"barcode": "VEG003", "name": "Blueberries (100g)", "calories": 57, "protein_g": 0.7, "carbs_g": 14, "fat_g": 0.3},
    ]

    with Session(engine) as session:
        for food_data in foods:
            product = session.get(Product, food_data["barcode"])
            if not product:
                product = Product(**food_data)
                session.add(product)
            else:
                # Update existing
                for key, value in food_data.items():
                    setattr(product, key, value)
                session.add(product)
        
        session.commit()
        print(f"Successfully seeded {len(foods)} core foods into the database.")

if __name__ == "__main__":
    seed_foods()
