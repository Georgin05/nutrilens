from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.database import get_session
from app.models.models import Product
from app.services.openfoodfacts import fetch_product_info
from app.services.analysis import parse_ingredients, explain_additives, calculate_health_score
from pydantic import BaseModel
from app.services.swaps import find_healthy_swaps
from app.models.product_schemas import ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

class ManualScanRequest(BaseModel):
    ingredients_text: str
    product_name: str = "Custom Entry"

def _build_product_response(product: Product, additives_tags: list = None) -> ProductResponse:
    flagged = parse_ingredients(product.ingredients)
    
    # In a real app we would cache additive tags in the DB too, 
    # but for simplicity we will only explain them if they come fresh from the API or we'd need to add a column
    # For now, we will just parse the ingredients for the local cache.
    additives_expl = explain_additives(additives_tags) if additives_tags else []
    
    health_score = calculate_health_score(
        nova_group=product.processed_level or 0,
        nutri_score=product.nutri_score.lower() if product.nutri_score else "unknown",
        flagged_count=len(flagged)
    )
    
    return ProductResponse(
        barcode=product.barcode,
        name=product.name,
        ingredients=product.ingredients,
        nutri_score=product.nutri_score,
        processed_level=product.processed_level,
        calories=product.calories,
        protein_g=product.protein_g,
        carbs_g=product.carbs_g,
        fat_g=product.fat_g,
        health_score=health_score,
        flagged_ingredients=flagged,
        additives_explanations=additives_expl
    )

@router.get("/{barcode}", response_model=ProductResponse)
def get_product_by_barcode(barcode: str, session: Session = Depends(get_session)):
    # 1. Check local DB cache
    product = session.get(Product, barcode)
    if product:
         return _build_product_response(product)

    # 2. If not in DB, fetch from Open Food Facts API
    api_data = fetch_product_info(barcode)
    
    if api_data:
        additives_tags = api_data.pop("additives", [])
        categories = api_data.pop("categories", [])
        
        # 3. Save to local DB
        new_product = Product(**api_data)
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        
        return _build_product_response(new_product, additives_tags)

    # 4. Return error if not found anywhere
    raise HTTPException(status_code=404, detail="Product not found")

@router.get("/{barcode}/swaps")
def get_product_swaps(barcode: str):
    # Fetch from API to get the full tags directly
    api_data = fetch_product_info(barcode)
    if not api_data:
        raise HTTPException(status_code=404, detail="Product not found")
        
    categories = api_data.get("categories", [])
    swaps = find_healthy_swaps(categories)
    return {"original": barcode, "swaps": swaps}

@router.post("/analyze-ingredients", response_model=ProductResponse)
def analyze_manual_ingredients(request: ManualScanRequest):
    """
    Simulated OCR Fallback: Analyzes raw ingredient text.
    """
    flagged = parse_ingredients(request.ingredients_text)
    
    # Estimate a simple Nutri-Score equivalent based purely on the text since we don't have exact chemistry
    health_score = calculate_health_score(
        nova_group=4 if flagged else 2, # Assume ultra-processed if flags exist
        nutri_score="unknown",
        flagged_count=len(flagged)
    )
    
    return ProductResponse(
        barcode="CUSTOM_ENTRY",
        name=request.product_name,
        ingredients=request.ingredients_text,
        nutri_score="?",
        processed_level=4 if flagged else 2,
        calories=0.0,
        protein_g=0.0,
        carbs_g=0.0,
        fat_g=0.0,
        health_score=health_score,
        flagged_ingredients=flagged,
        additives_explanations=[]
    )
