import requests
from typing import Optional, Dict, Any
from app.core.config import settings

def fetch_product_info(barcode: str) -> Optional[Dict[str, Any]]:
    """
    Fetches product information from the Open Food Facts API.
    """
    url = f"{settings.OPEN_FOOD_FACTS_URL}/{barcode}.json"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status() # Raise an exception for bad status codes
        data = response.json()
        
        if data.get("status") == 1:
            product_data = data.get("product", {})
            nutriments = product_data.get("nutriments", {})
            return {
                "barcode": barcode,
                "name": product_data.get("product_name", "Unknown Product"),
                "ingredients": product_data.get("ingredients_text", ""),
                "nutri_score": product_data.get("nutriscore_grade", "unknown").upper(),
                "processed_level": product_data.get("nova_group", 0), # 1-4, 0 if unknown
                "additives": product_data.get("additives_tags", []),
                "calories": nutriments.get("energy-kcal_100g"),
                "protein_g": nutriments.get("proteins_100g"),
                "carbs_g": nutriments.get("carbohydrates_100g"),
                "fat_g": nutriments.get("fat_100g"),
            }
        else:
            return None # Product not found
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for barcode {barcode}: {e}")
        return None
