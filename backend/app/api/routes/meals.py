from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, MealTemplate, MealPlan, DailyLog
from app.models.schemas import MealTemplateResponse, MealPlanResponse, MealPlanCreate
from app.services.meal_engine import generate_weekly_plan, smart_fill_day
from datetime import datetime
from pydantic import BaseModel
import json

router = APIRouter(prefix="/meals", tags=["Meals"])

@router.get("/templates", response_model=List[MealTemplateResponse])
def get_meal_templates(session: Session = Depends(get_session)):
    statement = select(MealTemplate)
    return session.exec(statement).all()

from app.models.schemas import MealTemplateCreate

@router.post("/templates", response_model=MealTemplateResponse)
def create_meal_template(meal_in: MealTemplateCreate, is_admin: bool = False, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # If is_admin is True, set user_id to None (Common DB)
    # real production code would check admin permissions here
    user_id = None if is_admin else current_user.id
    
    db_meal = MealTemplate(
        user_id=user_id,
        name=meal_in.name,
        meal_type=meal_in.meal_type,
        food_items_json=meal_in.food_items_json,
        calories=meal_in.calories,
        protein_g=meal_in.protein_g,
        carbs_g=meal_in.carbs_g,
        fat_g=meal_in.fat_g,
        image_url=meal_in.image_url,
        tags_json=meal_in.tags_json,
        estimated_cost=meal_in.estimated_cost
    )
    session.add(db_meal)
    session.commit()
    session.refresh(db_meal)
    return db_meal

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

class CloneDayRequest(BaseModel):
    source_day: str

@router.get("/library", response_model=List[MealTemplateResponse])
def get_meal_library(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(MealTemplate).where((MealTemplate.user_id == current_user.id) | (MealTemplate.user_id == None))
    return session.exec(statement).all()

@router.post("/plan", response_model=MealPlanResponse)
def add_meal_to_plan(plan_data: MealPlanCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    new_plan = MealPlan(
        user_id=current_user.id,
        day_of_week=plan_data.day_of_week,
        meal_type=plan_data.meal_type,
        meal_template_id=plan_data.meal_template_id
    )
    session.add(new_plan)
    session.commit()
    session.refresh(new_plan)
    return new_plan

@router.delete("/plan/{plan_id}")
def remove_meal_from_plan(plan_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    plan = session.get(MealPlan, plan_id)
    if not plan or plan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Plan entry not found")
    session.delete(plan)
    session.commit()
    return {"message": "Plan entry removed"}

@router.post("/plan/{plan_id}/repeat")
def repeat_meal_for_week(plan_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    plan = session.get(MealPlan, plan_id)
    if not plan or plan.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Plan entry not found")
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    added = 0
    for day in days:
        if day != plan.day_of_week:
            # Check if meal type already filled
            existing = session.exec(select(MealPlan).where(
                MealPlan.user_id == current_user.id,
                MealPlan.day_of_week == day,
                MealPlan.meal_type == plan.meal_type
            )).first()
            if not existing:
                new_plan = MealPlan(
                    user_id=current_user.id,
                    day_of_week=day,
                    meal_type=plan.meal_type,
                    meal_template_id=plan.meal_template_id
                )
                session.add(new_plan)
                added += 1
    session.commit()
    return {"message": f"Meal repeated for {added} days"}

@router.post("/plan/clone-day")
def clone_day_to_all(request: CloneDayRequest, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    source_plans = session.exec(select(MealPlan).where(
        MealPlan.user_id == current_user.id,
        MealPlan.day_of_week == request.source_day
    )).all()
    
    if not source_plans:
        raise HTTPException(status_code=400, detail="Source day is empty")
        
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    for day in days:
        if day != request.source_day:
            # Delete existing meals for the day
            existing = session.exec(select(MealPlan).where(
                MealPlan.user_id == current_user.id,
                MealPlan.day_of_week == day
            )).all()
            for e in existing:
                session.delete(e)
            
            # Clone new ones
            for plan in source_plans:
                new_plan = MealPlan(
                    user_id=current_user.id,
                    day_of_week=day,
                    meal_type=plan.meal_type,
                    meal_template_id=plan.meal_template_id
                )
                session.add(new_plan)
    session.commit()
    return {"message": f"Cloned {request.source_day} to all other days"}

@router.post("/plan/{day_of_week}/smart-fill")
def auto_fill_day(day_of_week: str, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    success = smart_fill_day(session, current_user, day_of_week)
    if not success:
        raise HTTPException(status_code=400, detail="Could not auto-fill. Check lens settings.")
    return {"message": f"Successfully auto-filled missing meals for {day_of_week}"}
