from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.db.database import get_session
from app.models.models import User, MealPlan, MealTemplate
from app.api.deps import get_current_user
from app.services.meal_engine import generate_weekly_plan, get_aggregated_groceries

router = APIRouter(prefix="/meal-cart", tags=["Meal Cart"])

@router.post("/setup")
def setup_meal_plan(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Generates or regenerates a 7-day meal plan based on the active lens."""
    success = generate_weekly_plan(session, current_user)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not generate meal plan. Ensure you have an active lens and meal templates available."
        )
    return {"message": "Weekly meal plan generated successfully"}

@router.get("/plan")
def get_meal_plan(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Retrieves the current 7-day meal plan."""
    statement = select(MealPlan, MealTemplate).join(MealTemplate).where(MealPlan.user_id == current_user.id)
    results = session.exec(statement).all()
    
    # Organize by day
    plan_by_day = {}
    for plan, template in results:
        day = plan.day_of_week
        if day not in plan_by_day:
            plan_by_day[day] = []
        
        plan_by_day[day].append({
            "id": plan.id,
            "meal_type": plan.meal_type,
            "template_id": template.id,
            "name": template.name,
            "calories": template.calories,
            "protein_g": template.protein_g,
            "carbs_g": template.carbs_g,
            "fat_g": template.fat_g,
            "image_url": template.image_url,
            "food_items": template.food_items_json
        })
    
    return plan_by_day

@router.get("/groceries")
def get_groceries(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Retrieves aggregated grocery items for the current plan."""
    groceries = get_aggregated_groceries(session, current_user.id)
    return groceries
