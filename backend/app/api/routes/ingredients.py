from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, IngredientPrice
from app.models.schemas import IngredientPriceCreate, IngredientPriceResponse

router = APIRouter(prefix="/ingredients", tags=["Ingredient Prices"])

@router.get("/prices", response_model=List[IngredientPriceResponse])
def get_all_prices(session: Session = Depends(get_session)):
    """Get all ingredient prices (public)"""
    return session.exec(select(IngredientPrice).order_by(IngredientPrice.name)).all()

@router.get("/prices/search")
def search_price(name: str, session: Session = Depends(get_session)):
    """Fuzzy search ingredient price by name"""
    statement = select(IngredientPrice).where(IngredientPrice.name.ilike(f"%{name}%"))
    results = session.exec(statement).all()
    return results

@router.post("/prices", response_model=IngredientPriceResponse)
def create_or_update_price(
    price_in: IngredientPriceCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Admin: Create or update an ingredient price"""
    existing = session.exec(
        select(IngredientPrice).where(IngredientPrice.name == price_in.name)
    ).first()
    
    if existing:
        existing.price = price_in.price
        existing.unit = price_in.unit
        existing.last_updated = datetime.utcnow()
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing
    
    new_price = IngredientPrice(
        name=price_in.name,
        price=price_in.price,
        unit=price_in.unit
    )
    session.add(new_price)
    session.commit()
    session.refresh(new_price)
    return new_price

@router.put("/prices/{price_id}", response_model=IngredientPriceResponse)
def update_price(
    price_id: int,
    price_in: IngredientPriceCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Admin: Update price by ID"""
    item = session.get(IngredientPrice, price_id)
    if not item:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    item.name = price_in.name
    item.price = price_in.price
    item.unit = price_in.unit
    item.last_updated = datetime.utcnow()
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.delete("/prices/{price_id}")
def delete_price(
    price_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Admin: Delete ingredient price"""
    item = session.get(IngredientPrice, price_id)
    if not item:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    session.delete(item)
    session.commit()
    return {"message": f"Deleted price for {item.name}"}
