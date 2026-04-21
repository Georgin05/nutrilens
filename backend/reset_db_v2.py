from sqlalchemy import text
from app.db.database import engine
from app.models.models import User, Product, DailyLog, ShoppingList, ScanLog, CustomLens, SmartCart, MealTemplate, MealPlan, UserNutritionProfile
from sqlmodel import SQLModel

def reset_db_robust():
    tables = [
        "meal_plans",
        "meal_templates",
        "smart_carts",
        "custom_lenses",
        "scan_logs",
        "shopping_list",
        "daily_logs",
        "user_nutrition_profile",
        "product",
        "user"
    ]
    
    with engine.connect() as conn:
        print("Dropping tables with CASCADE...")
        for table in tables:
            conn.execute(text(f"DROP TABLE IF EXISTS \"{table}\" CASCADE"))
        conn.commit()
    
    print("Creating all tables via SQLModel...")
    SQLModel.metadata.create_all(engine)
    print("Done!")

if __name__ == "__main__":
    reset_db_robust()
