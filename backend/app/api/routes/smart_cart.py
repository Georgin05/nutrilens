from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.db.database import get_session as get_db
from app.api.deps import get_current_user
from app.models.models import User, SmartCart
from app.models.schemas import SmartCartCreate, SmartCartResponse
from app.services.smart_cart_engine import generate_mock_smart_cart
from app.services.admin_activity_service import log_activity

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
    log_activity(
        session=session,
        user_id=current_user.id,
        action="smart_cart",
        target="smart_cart",
        metadata={"duration": cart_in.duration, "diet_lens": cart_in.diet_lens, "budget": cart_in.budget, "people": cart_in.people},
        commit=False,
    )
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
