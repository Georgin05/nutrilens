from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.database import get_session
from app.models.models import User, CustomLens, Product, MealTemplate, AIChatHistory, DailyLog, MealPlan

router = APIRouter(prefix="/admin", tags=["Admin"])

# ---- Module 1: User Management ----
@router.get("/users")
def get_all_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.get("/users/{user_id}")
def get_user_details(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    logs = session.exec(select(DailyLog).where(DailyLog.user_id == user_id)).all()
    lens = session.get(CustomLens, user.active_lens_id) if user.active_lens_id else None
    return {"user": user, "logs": logs, "active_lens": lens}

class UserUpdate(BaseModel):
    health_goal: Optional[str] = None
    weight_kg: Optional[float] = None
    activity_level: Optional[float] = None

@router.patch("/users/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

# ---- Module 2: Lenses ----
@router.get("/lenses")
def get_all_lenses(session: Session = Depends(get_session)):
    lenses = session.exec(select(CustomLens)).all()
    return lenses

class LensCreateAdmin(BaseModel):
    name: str
    theme_color: str
    icon: str = "visibility"
    calorie_modifier: float
    protein_ratio: float
    carb_ratio: float
    fat_ratio: float

@router.post("/lenses")
def create_lens_admin(lens_in: LensCreateAdmin, session: Session = Depends(get_session)):
    new_lens = CustomLens(is_system=True, **lens_in.dict())
    session.add(new_lens)
    session.commit()
    session.refresh(new_lens)
    return new_lens

@router.put("/lenses/{lens_id}")
def update_lens_admin(lens_id: int, lens_in: LensCreateAdmin, session: Session = Depends(get_session)):
    lens = session.get(CustomLens, lens_id)
    if not lens:
        raise HTTPException(status_code=404, detail="Lens not found")
    
    update_data = lens_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lens, key, value)
        
    session.add(lens)
    session.commit()
    session.refresh(lens)
    return lens

@router.delete("/lenses/{lens_id}")
def delete_lens(lens_id: int, session: Session = Depends(get_session)):
    lens = session.get(CustomLens, lens_id)
    if not lens:
        raise HTTPException(status_code=404, detail="Lens not found")
    session.delete(lens)
    session.commit()
    return {"ok": True}

# ---- Module 3: Products ----
@router.get("/products")
def get_all_products(session: Session = Depends(get_session)):
    return session.exec(select(Product)).all()

class ProductUpdateCreate(BaseModel):
    barcode: str
    name: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float

@router.post("/products")
def create_product(product_in: ProductUpdateCreate, session: Session = Depends(get_session)):
    prod = Product(**product_in.dict())
    session.add(prod)
    session.commit()
    session.refresh(prod)
    return prod

@router.delete("/products/{barcode}")
def delete_product(barcode: str, session: Session = Depends(get_session)):
    prod = session.get(Product, barcode)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    session.delete(prod)
    session.commit()
    return {"ok": True}

# ---- Module 4: Meals ----
@router.get("/meals/templates")
def get_meal_templates(session: Session = Depends(get_session)):
    return session.exec(select(MealTemplate)).all()

class MealTemplateCreate(BaseModel):
    name: str
    meal_type: str
    food_items_json: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float

@router.post("/meals/templates")
def create_meal_template(template_in: MealTemplateCreate, session: Session = Depends(get_session)):
    tmpl = MealTemplate(**template_in.dict())
    session.add(tmpl)
    session.commit()
    session.refresh(tmpl)
    return tmpl

@router.delete("/meals/templates/{tmpl_id}")
def delete_meal_template(tmpl_id: int, session: Session = Depends(get_session)):
    tmpl = session.get(MealTemplate, tmpl_id)
    if not tmpl:
        raise HTTPException(status_code=404, detail="Meal template not found")
    session.delete(tmpl)
    session.commit()
    return {"ok": True}

# ---- Module 5: AI Monitoring ----
@router.get("/ai/conversations")
def get_ai_conversations(session: Session = Depends(get_session)):
    return session.exec(select(AIChatHistory)).all()

# ---- Module 6: Analytics Dashboard ----
@router.get("/analytics/overview")
def get_analytics(session: Session = Depends(get_session)):
    total_users = len(session.exec(select(User)).all())
    total_logs = len(session.exec(select(DailyLog)).all())
    templates_count = len(session.exec(select(MealTemplate)).all())
    return {
        "total_users": total_users,
        "active_users": total_users,  # Mock
        "total_logs": total_logs,
        "meal_templates": templates_count,
        "most_used_lens": "Muscle Peak"
    }
