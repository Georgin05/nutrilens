from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables, engine
from app.api.routes import products, users, logs, analytics, inventory, dashboard, lenses, smart_cart, meals
from app.models.models import User, CustomLens, MealTemplate
from sqlmodel import Session, select
import json

# Database Initialization
def lifespan(app: FastAPI):
    create_db_and_tables()
    
    # Auto-seed basic requirements for MVP speed
    with Session(engine) as session:
        # Create default user if missing
        user = session.exec(select(User)).first()
        if not user:
            user = User(
                email="test@example.com",
                password_hash="hashed",
                health_goal="Muscle Gain",
                weight_kg=75.0,
                height_cm=180.0,
                age_years=25,
                gender="male",
                activity_level=1.2
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        
        # Ensure a lens exists and is linked
        lens = session.exec(select(CustomLens)).first()
        if not lens:
            lens = CustomLens(
                user_id=user.id,
                name="Muscle Peak",
                theme_color="emerald",
                calorie_modifier=400.0,
                protein_ratio=0.3,
                carb_ratio=0.5,
                fat_ratio=0.2
            )
            session.add(lens)
            session.commit()
            session.refresh(lens)
        
        if not user.active_lens_id:
            user.active_lens_id = lens.id
            session.add(user)
            session.commit()

        # Ensure Meal Templates exist
        from app.models.models import MealPlan
        if not session.exec(select(MealTemplate)).first():
            templates = [
                {
                    "name": "Classic Oats & Protein", "meal_type": "Breakfast", "calories": 450, "protein_g": 30, "carbs_g": 50, "fat_g": 12,
                    "food_items_json": json.dumps([{"name": "Oats", "quantity": 60, "unit": "g", "category": "Carbs"}])
                },
                {
                    "name": "Grilled Chicken Bowl", "meal_type": "Lunch", "calories": 650, "protein_g": 45, "carbs_g": 60, "fat_g": 15,
                    "food_items_json": json.dumps([{"name": "Chicken", "quantity": 200, "unit": "g", "category": "Protein"}])
                },
                {
                    "name": "Baked Salmon Plate", "meal_type": "Dinner", "calories": 550, "protein_g": 35, "carbs_g": 15, "fat_g": 38,
                    "food_items_json": json.dumps([{"name": "Salmon", "quantity": 180, "unit": "g", "category": "Protein"}])
                }
            ]
            for t_data in templates:
                tmpl = MealTemplate(**t_data)
                session.add(tmpl)
                session.commit()
                # Create a simple plan for Monday
                session.add(MealPlan(user_id=user.id, meal_template_id=tmpl.id, day_of_week="Monday", meal_type=tmpl.meal_type))
            session.commit()

    yield

app = FastAPI(
    title="NutriLens API",
    description="Backend API for the NutriLens Application",
    version="1.0.0",
    lifespan=lifespan
)


# CORS Middleware for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(products.router)
app.include_router(users.router)
app.include_router(logs.router)
app.include_router(analytics.router)
app.include_router(inventory.router)
app.include_router(dashboard.router)
app.include_router(lenses.router, prefix="/lenses", tags=["Lenses"])
app.include_router(smart_cart.router, prefix="/smart-cart", tags=["Smart Cart"])
app.include_router(meals.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to NutriLens API"}
