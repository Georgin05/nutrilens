from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, CustomLens, Product
from app.models.schemas import CustomLensCreate, CustomLensResponse
from app.services.lenses import evaluate_food_by_lens
from app.services.openfoodfacts import fetch_product_info
import json

router = APIRouter()

@router.post("/", response_model=CustomLensResponse)
def create_custom_lens(lens_in: CustomLensCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """
    Saves a new Custom Lens tailored by the user in the Setup Wizard.
    """
    flagged_json = json.dumps(lens_in.flagged_ingredients) if lens_in.flagged_ingredients else None
    
    new_lens = CustomLens(
        user_id=current_user.id,
        name=lens_in.name,
        theme_color=lens_in.theme_color,
        calorie_limit=lens_in.calorie_limit,
        min_protein_g=lens_in.min_protein_g,
        max_sugar_g=lens_in.max_sugar_g,
        flagged_ingredients_json=flagged_json
    )
    
    session.add(new_lens)
    session.commit()
    session.refresh(new_lens)
    
    # Return formatted response
    response = CustomLensResponse(
        **new_lens.dict(),
        flagged_ingredients=lens_in.flagged_ingredients # Pass back list format
    )
    return response

@router.get("/system", response_model=List[CustomLensResponse])
def get_system_lenses(session: Session = Depends(get_session)):
    """
    Retrieves all default system lenses to show in the Registration Goal picker.
    """
    statement = select(CustomLens).where(CustomLens.is_system == True)
    results = session.exec(statement).all()
    
    response_list = []
    for lens in results:
        flagged_list = json.loads(lens.flagged_ingredients_json) if lens.flagged_ingredients_json else []
        # user_id is optional but CustomLensResponse usually expects it. We can default to 0 for system lenses.
        lens_dict = lens.dict()
        if lens_dict.get("user_id") is None:
            lens_dict["user_id"] = 0
            
        r = CustomLensResponse(**lens_dict, flagged_ingredients=flagged_list)
        response_list.append(r)
        
    return response_list

@router.get("/custom", response_model=List[CustomLensResponse])
def get_user_custom_lenses(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """
    Retrieves all custom lenses created by the logged-in user to show in the Gallery.
    """
    statement = select(CustomLens).where(CustomLens.user_id == current_user.id)
    results = session.exec(statement).all()
    
    response_list = []
    for lens in results:
        flagged_list = json.loads(lens.flagged_ingredients_json) if lens.flagged_ingredients_json else []
        lens_dict = lens.dict()
        if lens_dict.get("user_id") is None:
            lens_dict["user_id"] = 0
        r = CustomLensResponse(**lens_dict, flagged_ingredients=flagged_list)
        response_list.append(r)
        
    return response_list

@router.get("/evaluate/{barcode}")
def evaluate_product_with_lens(barcode: str, lens_id: str, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    """
    Calculates a dynamic score for a specific product based on the provided lens_id 
    (can be a preset string name or the integer ID of a Custom Lens).
    """
    
    # 1. Fetch Product Data
    product = session.get(Product, barcode)
    if product:
        product_data = product.dict()
    else:
        # Fallback to API if not in DB yet
        api_data = fetch_product_info(barcode)
        if not api_data:
             raise HTTPException(status_code=404, detail="Product not found via API.")
        product_data = api_data
        
    # 2. Fetch Lens from DB
    lens = None
    if lens_id.isdigit():
        lens = session.get(CustomLens, int(lens_id))
    
    if not lens:
        # Try finding by name (for presets passed dynamically via frontend name)
        stmt = select(CustomLens).where(CustomLens.name.ilike(lens_id.replace("_", " ")))
        lens = session.exec(stmt).first()
        
    if not lens:
        raise HTTPException(status_code=404, detail="Lens not found.")
        
    # 3. Evaluate!
    result = evaluate_food_by_lens(product_data, lens)
    
    return {
        "product_name": product_data.get('name', 'Unknown Product'),
        "evaluation": result
    }
