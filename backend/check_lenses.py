from sqlmodel import Session, create_engine, select
from app.models.models import CustomLens
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/nutrilens"

engine = create_engine(DATABASE_URL)

def check_lenses():
    try:
        with Session(engine) as session:
            statement = select(CustomLens).where(CustomLens.is_system == True)
            results = session.exec(statement).all()
            print(f"Found {len(results)} system lenses.")
            for l in results:
                print(f"- {l.name} (icon: {l.icon})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_lenses()
