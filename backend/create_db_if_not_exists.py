
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_db():
    conn = psycopg2.connect(user="postgres", host="localhost", password="admin123")
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'nutrilens'")
    exists = cur.fetchone()
    if not exists:
        print("Creating database nutrilens...")
        cur.execute("CREATE DATABASE nutrilens")
    else:
        print("Database nutrilens already exists.")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    try:
        create_db()
    except Exception as e:
        print(f"Error: {e}")
