from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db.database import get_session
from app.models.models import Product
from app.services.openfoodfacts import fetch_product_info
from app.services.analysis import parse_ingredients, explain_additives, calculate_health_score
from app.models.product_schemas import ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

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
        
        # 3. Save to local DB
        new_product = Product(**api_data)
        session.add(new_product)
        session.commit()
        session.refresh(new_product)
        
        return _build_product_response(new_product, additives_tags)

    # 4. Return error if not found anywhere
    raise HTTPException(status_code=404, detail="Product not found")
