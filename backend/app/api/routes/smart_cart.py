from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel

from app.db.database import get_session as get_db
from app.api.deps import get_current_user
from app.models.models import User, SmartCart, ShoppingList, IngredientPrice
from app.models.schemas import SmartCartCreate, SmartCartResponse, ShoppingListResponse
from app.services.smart_cart_engine import generate_mock_smart_cart
from app.services.meal_engine import get_aggregated_groceries

router = APIRouter()

@router.post("/", response_model=SmartCartResponse, status_code=status.HTTP_201_CREATED)
def create_smart_cart(*, session: Session = Depends(get_db), current_user: User = Depends(get_current_user), cart_in: SmartCartCreate):
    # Call the engine to simulate the 7-step pipeline and generate the JSON payload
    cart_json = generate_mock_smart_cart(
        duration=cart_in.duration,
        diet_lens=cart_in.diet_lens,
        budget=cart_in.budget,
        people=cart_in.people
    )
    
    # Save the output to database
    db_cart = SmartCart(
        user_id=current_user.id,
        duration=cart_in.duration,
        diet_lens=cart_in.diet_lens,
        budget=cart_in.budget,
        people=cart_in.people,
        cart_json=cart_json
    )
    session.add(db_cart)
    session.commit()
    session.refresh(db_cart)
    return db_cart

@router.get("/latest", response_model=SmartCartResponse)
def get_latest_smart_cart(*, session: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Retrieve the most recent cart for the current user
    statement = select(SmartCart).where(SmartCart.user_id == current_user.id).order_by(SmartCart.created_at.desc()).limit(1)
    db_cart = session.exec(statement).first()
    
    if not db_cart:
        raise HTTPException(status_code=404, detail="No smart cart found for this user")
        
    return db_cart

def _lookup_price(session: Session, item_name: str) -> float:
    """Look up price from the IngredientPrice table using fuzzy match."""
    # Exact match first
    result = session.exec(
        select(IngredientPrice).where(IngredientPrice.name == item_name)
    ).first()
    if result:
        return result.price
    
    # Fuzzy match: try partial
    result = session.exec(
        select(IngredientPrice).where(IngredientPrice.name.ilike(f"%{item_name}%"))
    ).first()
    if result:
        return result.price
    
    # Try with first word only (e.g. "Chicken Breast" -> "Chicken")
    first_word = item_name.split()[0] if item_name else ""
    if first_word and len(first_word) > 3:
        result = session.exec(
            select(IngredientPrice).where(IngredientPrice.name.ilike(f"%{first_word}%"))
        ).first()
        if result:
            return result.price
    
    return 0.0

@router.post("/generate-from-plan", response_model=List[ShoppingListResponse])
def generate_from_plan(session: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Get aggregated ingredients from meal plan
    grocery_items = get_aggregated_groceries(session, current_user.id)
    
    if not grocery_items:
        raise HTTPException(status_code=400, detail="No meal plan found. Generate one in Meal Planner first.")
        
    # 2. Clear existing shopping list for the user
    existing_items = session.exec(select(ShoppingList).where(ShoppingList.user_id == current_user.id)).all()
    for item in existing_items:
        session.delete(item)
    
    # 3. Create new shopping list entries with estimated prices
    new_entries = []
    for item in grocery_items:
        estimated_price = _lookup_price(session, item["name"])
        
        new_entry = ShoppingList(
            user_id=current_user.id,
            item_name=item["name"],
            category=item["category"],
            quantity=item["quantity"],
            unit=item["unit"],
            price=estimated_price,
            status="pending"
        )
        session.add(new_entry)
        new_entries.append(new_entry)
        
    session.commit()
    for entry in new_entries:
        session.refresh(entry)
        
    return new_entries

@router.get("/list", response_model=List[ShoppingListResponse])
def get_shopping_list(session: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    statement = select(ShoppingList).where(ShoppingList.user_id == current_user.id)
    return session.exec(statement).all()

class ItemPriceUpdate(BaseModel):
    price: float

@router.patch("/item/{item_id}", response_model=ShoppingListResponse)
def update_item_status(item_id: int, status: str = None, session: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = session.get(ShoppingList, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if status:
        item.status = status
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.patch("/item/{item_id}/price", response_model=ShoppingListResponse)
def update_item_price(item_id: int, body: ItemPriceUpdate, session: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Update individual grocery item price"""
    item = session.get(ShoppingList, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.price = body.price
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

