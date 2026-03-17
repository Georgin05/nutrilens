from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, MealTemplate, MealPlan, DailyLog
from app.models.schemas import MealTemplateResponse, MealPlanResponse, MealPlanCreate
from app.services.meal_engine import generate_weekly_plan
from datetime import datetime
import json

router = APIRouter(prefix="/meals", tags=["Meals"])

@router.get("/templates", response_model=List[MealTemplateResponse])
def get_meal_templates(session: Session = Depends(get_session)):
    statement = select(MealTemplate)
    return session.exec(statement).all()

@router.get("/weekly", response_model=List[MealPlanResponse])
def get_weekly_plan(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(MealPlan).where(MealPlan.user_id == current_user.id)
    return session.exec(statement).all()

@router.post("/generate-weekly")
def generate_weekly(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    success = generate_weekly_plan(session, current_user)
    if not success:
        raise HTTPException(status_code=400, detail="Could not generate plan. Check targets and templates.")
    return {"message": "Weekly plan generated successfully"}

@router.post("/log-planned-meal/{plan_id}")
def log_planned_meal(plan_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    plan = session.get(MealPlan, plan_id)
    if not plan or plan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Plan entry not found")
        
    template = session.get(MealTemplate, plan.meal_template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
        
    # Create the daily log entry
    new_log = DailyLog(
        user_id=current_user.id,
        product_name=template.name,
        calories=template.calories,
        protein_g=template.protein_g,
        carbs_g=template.carbs_g,
        fat_g=template.fat_g,
        meal_type=plan.meal_type,
        serving_size=1.0,
        timestamp=datetime.utcnow()
    )
    session.add(new_log)
    session.commit()
    session.refresh(new_log)
    
    return {"message": f"Logged {template.name} as {plan.meal_type}", "log_id": new_log.id}
