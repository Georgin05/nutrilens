from app.db.database import engine
from sqlmodel import Session, select
from app.models.models import User, CustomLens, MealTemplate
from app.services.meal_engine import generate_weekly_plan

def diag_amal():
    with Session(engine) as session:
        u = session.exec(select(User).where(User.email == "amal@gmail.com")).first()
        if not u:
            print("User amal@gmail.com not found")
            return
        
        print(f"User: {u.email} (ID: {u.id})")
        print(f"Active Lens ID: {u.active_lens_id}")
        
        lens = session.get(CustomLens, u.active_lens_id) if u.active_lens_id else None
        print(f"Active Lens Name: {lens.name if lens else 'None'}")
        
        templates = session.exec(select(MealTemplate)).all()
        print(f"Meal Templates Count: {len(templates)}")
        for t in templates:
            print(f" - {t.name} ({t.meal_type})")
            
        success = generate_weekly_plan(session, u)
        print(f"Generation Success: {success}")

if __name__ == "__main__":
    diag_amal()
