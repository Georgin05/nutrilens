import requests
from typing import List, Dict, Any
from app.core.config import settings

def find_healthy_swaps(categories: List[str]) -> List[Dict[str, Any]]:
    """
    Finds healthier alternatives based on the product's categories.
    Looks for products with Nutri-Score A or B.
    """
    if not categories:
        return []

    # Get the most specific category (usually the last one in the list for Open Food Facts en: tags)
    target_category = categories[-1].replace("en:", "")

    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "action": "process",
        "tagtype_0": "categories",
        "tag_contains_0": "contains",
        "tag_0": target_category,
        "tagtype_1": "nutrition_grades",
        "tag_contains_1": "contains",
        "tag_1": "A", # Try to find 'A' rated products first
        "sort_by": "unique_scans_n", # Sort by popularity
        "page_size": 3,
        "json": "true"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        swaps = []
        for prod in data.get("products", []):
            swaps.append({
                "barcode": prod.get("code"),
                "name": prod.get("product_name", "Unknown alternative"),
                "nutri_score": prod.get("nutriscore_grade", "unknown").upper(),
                "image_url": prod.get("image_front_url", "")
            })
            
        return swaps
    except requests.exceptions.RequestException as e:
        print(f"Error fetching swaps for category {target_category}: {e}")
        return []
