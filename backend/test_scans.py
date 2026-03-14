import asyncio
from app.services.openfoodfacts import fetch_product_info
from app.services.analysis import parse_ingredients, calculate_health_score

# 5 Common Real-World Barcodes
# 1. Coca Cola Classic (UK/EU)
# 2. Ferrero Rocher
# 3. Oreo Cookies
# 4. Nutella
# 5. Tap water (Invalid/Clean test)

TEST_BARCODES = [
    "5449000000996",  # Coca Cola
    "8000500167106",  # Ferrero Rocher
    "7622300441443",  # Oreos
    "3017620422003",  # Nutella
    "8715700421360"   # Heinz Ketchup
]

def run_tests():
    print("--- Starting Real-World Barcode Tests ---\n")
    for barcode in TEST_BARCODES:
        print(f"Testing Barcode: {barcode}")
        data = fetch_product_info(barcode)
        
        if not data:
            print(f"  Result: Not found in Open Food Facts cache.\n")
            continue
            
        print(f"  Name: {data['name']}")
        print(f"  Nutri-Score: {data['nutri_score']}")
        print(f"  NOVA Processed Level: {data['processed_level']}")
        
        ingredients = data.get('ingredients', '')
        flagged = parse_ingredients(ingredients)
        score = calculate_health_score(data['processed_level'] or 0, data['nutri_score'], len(flagged))
        
        print(f"  Flagged Ingredients: {len(flagged)}")
        for flag in flagged:
            print(f"    - {flag['ingredient']}: {flag['warning']}")
            
        print(f"  Final Health Score: {score}\n")
        print("-" * 40 + "\n")

if __name__ == "__main__":
    run_tests()
