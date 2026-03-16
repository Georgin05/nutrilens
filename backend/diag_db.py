
import psycopg2
from psycopg2 import sql

def diag():
    try:
        conn = psycopg2.connect(
            dbname="nutrilens", 
            user="postgres", 
            password="admin123", 
            host="localhost"
        )
        cur = conn.cursor()
        print("Connected to database successfully.")
        
        # Check column existence
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='daily_logs' AND column_name='meal_type'
        """)
        exists = cur.fetchone()
        if not exists:
            print("Column 'meal_type' missing. Adding it...")
            cur.execute("ALTER TABLE daily_logs ADD COLUMN meal_type VARCHAR DEFAULT 'Snacks'")
            conn.commit()
            print("Column added.")
        else:
            print("Column 'meal_type' exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    diag()
