from sqlalchemy import text
from app.db.database import engine

def migrate():
    print("Adding activity_level column...")
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE \"user\" ADD COLUMN activity_level FLOAT DEFAULT 1.2"))
            conn.commit()
            print("Successfully added activity_level.")
        except Exception as e:
            print(f"Error or column already exists: {e}")

    print("Updating custom_lenses table...")
    with engine.connect() as conn:
        cols = [
            ("calorie_modifier", "FLOAT DEFAULT 0.0"),
            ("protein_ratio", "FLOAT DEFAULT 0.3"),
            ("carb_ratio", "FLOAT DEFAULT 0.4"),
            ("fat_ratio", "FLOAT DEFAULT 0.3"),
            ("sugar_limit_g", "FLOAT")
        ]
        for col_name, col_type in cols:
            try:
                conn.execute(text(f"ALTER TABLE custom_lenses ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"Added column {col_name} to custom_lenses.")
            except Exception as e:
                print(f"Column {col_name} already exists or error: {e}")

    print("Creating meal_templates table...")
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS meal_templates (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    meal_type VARCHAR NOT NULL,
                    food_items_json TEXT NOT NULL,
                    calories FLOAT NOT NULL,
                    protein_g FLOAT NOT NULL,
                    carbs_g FLOAT NOT NULL,
                    fat_g FLOAT NOT NULL,
                    image_url VARCHAR
                )
            """))
            conn.commit()
            print("Successfully created meal_templates.")
        except Exception as e:
            print(f"Error creating meal_templates: {e}")

    print("Creating meal_plans table...")
    with engine.connect() as conn:
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS meal_plans (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES \"user\"(id),
                    day_of_week VARCHAR NOT NULL,
                    meal_type VARCHAR NOT NULL,
                    meal_template_id INTEGER REFERENCES meal_templates(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("Successfully created meal_plans.")
        except Exception as e:
            print(f"Error creating meal_plans: {e}")

if __name__ == "__main__":
    migrate()
