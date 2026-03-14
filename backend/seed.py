import sys
import os

# Ensure the backend directory is in the path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from datetime import datetime, timedelta
from app.db.database import engine, create_db_and_tables
from app.models.models import User, Product, DailyLog
from app.core.auth import get_password_hash

def seed_db():
    print("Initializing Database...")
    create_db_and_tables()
    with Session(engine) as session:
        # Create Test User
        user = session.exec(select(User).where(User.email == "test@example.com")).first()
        if not user:
            print("Creating test@example.com user...")
            user = User(
                email="test@example.com",
                password_hash=get_password_hash("password"),
                is_active=True,
                bmr=2150,
                health_goal="Weight Loss"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            print("User test@example.com already exists.")
        
        # Create Sample Products matching Dashboard Mock
        p1 = session.get(Product, "000000000001")
        if not p1:
            print("Adding Avocado Toast Product...")
            p1 = Product(
                barcode="000000000001",
                name="Avocado Toast",
                brand="Homemade",
                calories=320,
                protein_g=12,
                carbs_g=32,
                fat_g=18,
                ingredients="Avocado, Whole Wheat Bread, Olive Oil",
                processed_level=1,
                nutri_score="A"
            )
            session.add(p1)
            
        p2 = session.get(Product, "000000000002")
        if not p2:
            print("Adding Mediterranean Salad Product...")
            p2 = Product(
                barcode="000000000002",
                name="Mediterranean Salad",
                brand="Fresh Co.",
                calories=450,
                protein_g=18,
                carbs_g=45,
                fat_g=22,
                ingredients="Mixed Greens, Feta, Olives, Tomatoes, Vinaigrette",
                processed_level=1,
                nutri_score="A"
            )
            session.add(p2)
            session.commit()
            session.refresh(p1)
            session.refresh(p2)

        # Create Consumption Logs for Today (And Past Days for Weekly Graph)
        today_logs = session.exec(select(DailyLog).where(DailyLog.user_id == user.id)).all()
        if not today_logs:
            print("Injecting Daily Logs...")
            now = datetime.utcnow()
            
            # Today's Logs (Breakfast and Lunch)
            log1 = DailyLog(user_id=user.id, barcode=p1.barcode, serving_size=1.0, timestamp=now.replace(hour=8, minute=30))
            log2 = DailyLog(user_id=user.id, barcode=p2.barcode, serving_size=1.0, timestamp=now.replace(hour=13, minute=15))
            
            # Past logs to populate Weekly Quality Chart
            log3 = DailyLog(user_id=user.id, barcode=p1.barcode, serving_size=1.0, timestamp=now - timedelta(days=1))
            log4 = DailyLog(user_id=user.id, barcode=p2.barcode, serving_size=1.0, timestamp=now - timedelta(days=2))
            log5 = DailyLog(user_id=user.id, barcode=p1.barcode, serving_size=1.5, timestamp=now - timedelta(days=3))
            
            session.add(log1)
            session.add(log2)
            session.add(log3)
            session.add(log4)
            session.add(log5)
            session.commit()
            print("Successfully seeded DB with Daily Logs!")
        else:
            print("Daily logs already exist for user.")

if __name__ == "__main__":
    seed_db()
