from pydantic import BaseModel
from typing import Optional, List, Dict

class ProductResponse(BaseModel):
    barcode: str
    name: str
    ingredients: Optional[str] = None
    nutri_score: Optional[str] = None
    processed_level: Optional[int] = None
    
    # Analysis fields
    health_score: str # Green, Yellow, Red
    flagged_ingredients: List[Dict[str, str]]
    additives_explanations: List[Dict[str, str]]
