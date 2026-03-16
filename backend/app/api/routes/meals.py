from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, MealTemplate, WeekPlan
from app.models.schemas import MealTemplateResponse, WeekPlanResponse, WeekPlanCreate
import json

router = APIRouter(prefix="/meals", tags=["Meals"])

@router.get("/templates", response_model=List[MealTemplateResponse])
def get_meal_templates(session: Session = Depends(get_session)):
    statement = select(MealTemplate)
    return session.exec(statement).all()

@router.get("/weekly", response_model=List[WeekPlanResponse])
def get_weekly_plan(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(WeekPlan).where(WeekPlan.user_id == current_user.id)
    return session.exec(statement).all()

@router.post("/weekly", response_model=WeekPlanResponse)
def create_weekly_day_plan(plan_in: WeekPlanCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # Check if plan for this day already exists
    statement = select(WeekPlan).where(WeekPlan.user_id == current_user.id).where(WeekPlan.day == plan_in.day)
    existing = session.exec(statement).first()
    
    if existing:
        existing.breakfast_id = plan_in.breakfast_id
        existing.lunch_id = plan_in.lunch_id
        existing.dinner_id = plan_in.dinner_id
        existing.snack_id = plan_in.snack_id
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    
    new_plan = WeekPlan(user_id=current_user.id, **plan_in.model_dump())
    session.add(new_plan)
    session.commit()
    session.refresh(new_plan)
    return new_plan
