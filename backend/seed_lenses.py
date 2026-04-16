import json
from sqlmodel import Session, select
from app.db.database import engine
from app.models.models import CustomLens

def seed_system_lenses():
    system_lenses = [
        {
            "name": "Fat Loss",
            "theme_color": "green",
            "calorie_modifier": -500.0,
            "protein_ratio": 0.35, # 35%
            "carb_ratio": 0.35,    # 35%
            "fat_ratio": 0.30,     # 30%
            "sugar_limit_g": 30.0,
            "flagged_ingredients_json": "[]",
            "is_system": True,
            "icon": "monitor_weight"
        },
        {
            "name": "Muscle Build",
            "theme_color": "blue",
            "calorie_modifier": 300.0,
            "protein_ratio": 0.35, # 35%
            "carb_ratio": 0.45,    # 45%
            "fat_ratio": 0.20,     # 20%
            "sugar_limit_g": 50.0,
            "flagged_ingredients_json": "[]",
            "is_system": True,
            "icon": "fitness_center"
        },
        {
            "name": "Diabetes Friendly",
            "theme_color": "blue",
            "calorie_modifier": -200.0,
            "protein_ratio": 0.30, # 30%
            "carb_ratio": 0.25,    # 25%
            "fat_ratio": 0.45,     # 45%
            "sugar_limit_g": 10.0,
            "flagged_ingredients_json": "[]",
            "is_system": True,
            "icon": "medical_services"
        },
        {
            "name": "Athlete Performance",
            "theme_color": "orange",
            "calorie_modifier": 0.0,
            "protein_ratio": 0.25, # 25%
            "carb_ratio": 0.55,    # 55%
            "fat_ratio": 0.20,     # 20%
            "sugar_limit_g": 60.0,
            "flagged_ingredients_json": "[]",
            "is_system": True,
            "icon": "directions_run"
        },
        {
            "name": "Clean Eating",
            "theme_color": "green",
            "calorie_modifier": 0.0,
            "protein_ratio": 0.30, # 30%
            "carb_ratio": 0.40,    # 40%
            "fat_ratio": 0.30,     # 30%
            "sugar_limit_g": 25.0,
            "flagged_ingredients_json": json.dumps(["artificial", "preservative", "color", "flavor"]),
            "is_system": True,
            "icon": "eco"
        }
    ]

    with Session(engine) as session:
        for md in system_lenses:
            # Check if exists
            stmt = select(CustomLens).where(CustomLens.name == md["name"]).where(CustomLens.is_system == True)
            existing = session.exec(stmt).first()
            if not existing:
                lens = CustomLens(**md)
                session.add(lens)
                print(f"Added system lens: {md['name']}")
            else:
                # Update attributes to ensure they match seed just in case
                for key, value in md.items():
                    setattr(existing, key, value)
                session.add(existing)
                print(f"Updated system lens: {md['name']}")
        
        session.commit()
        print("System Lenses seeded successfully.")

if __name__ == "__main__":
    seed_system_lenses()
