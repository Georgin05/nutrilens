from sqlmodel import SQLModel
from app.db.database import engine
# Important: Import models so they are registered before drop_all/create_all
from app.models.models import User, Product, DailyLog, ShoppingList

def reset_db():
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("Creating all tables...")
    SQLModel.metadata.create_all(engine)
    print("Done!")

if __name__ == "__main__":
    reset_db()
