from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.db.database import get_session
from app.models.models import User, ShoppingList
from app.api.deps import get_current_user
from app.models.schemas import ShoppingListCreate, ShoppingListUpdate, ShoppingListResponse

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.post("/", response_model=ShoppingListResponse, status_code=status.HTTP_201_CREATED)
def add_inventory_item(
    item_in: ShoppingListCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_item = ShoppingList(
        user_id=current_user.id,
        item_name=item_in.item_name,
        is_healthy_swap=item_in.is_healthy_swap
    )
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item

@router.get("/", response_model=List[ShoppingListResponse])
def get_inventory(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(ShoppingList).where(ShoppingList.user_id == current_user.id)
    items = session.exec(statement).all()
    return items

@router.put("/{item_id}", response_model=ShoppingListResponse)
def update_inventory_item(
    item_id: int,
    item_update: ShoppingListUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    item = session.get(ShoppingList, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")

    if item_update.item_name is not None:
        item.item_name = item_update.item_name
    if item_update.status is not None:
        item.status = item_update.status
        
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(
    item_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    item = session.get(ShoppingList, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item not found")
        
    session.delete(item)
    session.commit()
