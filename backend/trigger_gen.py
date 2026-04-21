from sqlmodel import Session, select
from app.db.database import engine
from app.models.models import User
from app.services.meal_engine import generate_weekly_plan

def trigger_generation():
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == "test@example.com")).first()
        if not user:
            print("User not found!")
            return
            
        success = generate_weekly_plan(session, user)
        if success:
            print("Successfully generated weekly plan for test@example.com")
        else:
            print("Failed to generate plan. Check Lens and Templates.")

if __name__ == "__main__":
    trigger_generation()
