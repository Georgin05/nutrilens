import json

def generate_mock_smart_cart(duration: str, diet_lens: str, budget: float, people: int) -> str:
    """
    Simulates the AI engine generating a smart cart based on parameters.
    Returns a JSON string representing the cart payload.
    """
    multiplier = 4 if duration.lower() == 'monthly' else 1
    people_mult = max(1, people)
    total_mult = multiplier * people_mult

    # Base items scaled
    vegetables = [
        {"id": 1, "name": "Organic Baby Spinach", "desc": f"{2 * total_mult}x 500g bags", "price": 8.98 * total_mult, "checked": False},
        {"id": 2, "name": "Broccoli Crowns", "desc": f"{3 * total_mult} units", "price": 4.50 * total_mult, "checked": False}
    ]
    protein = [
        {"id": 3, "name": "Wild Caught Salmon", "desc": "Swap suggested for budget", "price": 24.00 * total_mult, "checked": False, "warning": True},
        {"id": 4, "name": "Greek Yogurt (Plain)", "desc": f"{1 * total_mult}kg tub", "price": 6.50 * total_mult, "checked": False}
    ]
    carbs = [
        {"id": 5, "name": "Quinoa (Bulk)", "desc": f"{1.5 * total_mult}kg", "price": 12.00 * total_mult, "checked": False}
    ]
    fats = [
        {"id": 6, "name": "Raw Almonds", "desc": "Better value option available", "price": 15.99 * total_mult, "checked": False, "warning": True}
    ]

    total_est = sum(i['price'] for c in [vegetables, protein, carbs, fats] for i in c)

    # Mock Swaps if over budget (or just arbitrary for demo)
    swaps = []
    opt_total = total_est
    if total_est > budget:
        swaps.append({
            "id": 1, 
            "original": "Almonds", 
            "new": "Peanuts", 
            "savings": 8.50 * total_mult, 
            "detail": "Peanuts offer similar protein and healthy fat profiles at 40% lower cost.", 
            "applied": False
        })
        swaps.append({
            "id": 2, 
            "original": "Salmon", 
            "new": "Canned Tuna", 
            "savings": 6.20 * total_mult, 
            "detail": "Maintain Omega-3 levels while significantly reducing the weekly protein spend.", 
            "applied": False
        })
        opt_total = total_est - (8.50 * total_mult) - (6.20 * total_mult)

    mock_coverage = {
        "protein": 85 if "Muscle" in diet_lens else 70,
        "fiber": 92 if "Fat" in diet_lens or "Clean" in diet_lens else 80
    }

    cart_payload = {
        "items": {
            "vegetables": vegetables,
            "protein": protein,
            "carbs": carbs,
            "fats": fats
        },
        "swaps": swaps,
        "coverage": mock_coverage,
        "totals": {
            "current": round(total_est, 2),
            "optimized": round(opt_total, 2)
        }
    }

    return json.dumps(cart_payload)
