import json
from sqlmodel import Session, select
from app.models.models import Food, MealTemplate, WeekPlan, CustomLens, UserNutritionProfile
from app.services.lens_engine import get_daily_target

def generate_meal_templates(session: Session):
    # This would ideally be a more complex matching logic.
    # For MVP, we'll create some fixed templates from the Food database.
    
    # 1. High Protein Breakfast
    # ... logic to select foods ...
    pass

def distribute_targets_to_meals(daily_target: dict):
    # Logic: Breakfast 25%, Lunch 35%, Dinner 30%, Snack 10%
    return {
        "Breakfast": {k: v * 0.25 for k, v in daily_target.items() if k != "sugar_limit_g"},
        "Lunch": {k: v * 0.35 for k, v in daily_target.items() if k != "sugar_limit_g"},
        "Dinner": {k: v * 0.30 for k, v in daily_target.items() if k != "sugar_limit_g"},
        "Snack": {k: v * 0.10 for k, v in daily_target.items() if k != "sugar_limit_g"}
    }

def get_weekly_plan(user_id: int, session: Session):
    # Fetch user's weekly plan if it exists
    statement = select(WeekPlan).where(WeekPlan.user_id == user_id)
    return session.exec(statement).all()
