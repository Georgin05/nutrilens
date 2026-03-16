from sqlalchemy import text
from app.db.database import engine

def migrate():
    with engine.connect() as conn:
        print("Adding activity_level column...")
        try:
            conn.execute(text("ALTER TABLE \"user\" ADD COLUMN activity_level FLOAT DEFAULT 1.2"))
            conn.commit()
            print("Successfully added activity_level.")
        except Exception as e:
            print(f"Error or column already exists: {e}")

        print("Adding active_lens_id column...")
        try:
            conn.execute(text("ALTER TABLE \"user\" ADD COLUMN active_lens_id INTEGER REFERENCES custom_lenses(id)"))
            conn.commit()
            print("Successfully added active_lens_id.")
        except Exception as e:
            print(f"Error or column already exists: {e}")

if __name__ == "__main__":
    migrate()
