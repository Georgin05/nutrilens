import json
from typing import List, Dict, Any

# Dictionary of hidden ingredients
HIDDEN_INGREDIENTS = {
    "high fructose corn syrup": "Added Sugar / Highly Processed",
    "maltodextrin": "Added Sugar / Spikes Blood Sugar",
    "partially hydrogenated": "Trans Fat / Bad for Heart Health",
    "sucralose": "Artificial Sweetener",
    "aspartame": "Artificial Sweetener",
    "msg": "Flavor Enhancer",
    "monosodium glutamate": "Flavor Enhancer",
    "carrageenan": "Thickener / May cause inflammation",
    "sodium nitrite": "Preservative / Linked to health issues",
    "sodium nitrate": "Preservative / Linked to health issues",
    "bha": "Preservative / Endocrine disruptor",
    "bht": "Preservative / Endocrine disruptor",
    "potassium bromate": "Flour improver / Banned in many countries",
    "artificial color": "Synthetic Dye",
    "red 40": "Synthetic Dye / May cause hyperactivity in children",
    "yellow 5": "Synthetic Dye",
    "blue 1": "Synthetic Dye",
}

# Additives mapping
ADDITIVES_DICT = {
    "E102": "Tartrazine (Yellow 5) - Synthetic yellow dye",
    "E129": "Allura Red AC (Red 40) - Synthetic red dye",
    "E150a": "Plain Caramel - Food coloring",
    "E150d": "Sulphite ammonia caramel - Food coloring",
    "E202": "Potassium sorbate - Preservative",
    "E211": "Sodium benzoate - Preservative",
    "E250": "Sodium nitrite - Preservative for meats",
    "E300": "Ascorbic acid (Vitamin C) - Antioxidant",
    "E322": "Lecithins - Emulsifier",
    "E330": "Citric acid - Acidity regulator",
    "E407": "Carrageenan - Thickener/Gelling agent",
    "E412": "Guar gum - Thickener",
    "E415": "Xanthan gum - Thickener/Stabilizer",
    "E422": "Glycerol - Humectant/Sweetener",
    "E450": "Diphosphates - Emulsifier/Stabilizer",
    "E621": "Monosodium glutamate (MSG) - Flavor enhancer",
    "E950": "Acesulfame K - Artificial sweetener",
    "E951": "Aspartame - Artificial sweetener",
    "E955": "Sucralose - Artificial sweetener",
}

def parse_ingredients(ingredient_text: str) -> List[Dict[str, str]]:
    """
    Analyzes ingredient text for hidden or ultra-processed ingredients.
    Returns a list of flagged items with their descriptions.
    """
    if not ingredient_text:
        return []
    
    flagged = []
    text_lower = ingredient_text.lower()
    
    for key, desc in HIDDEN_INGREDIENTS.items():
        if key in text_lower:
            flagged.append({"ingredient": key.title(), "warning": desc})
            
    return flagged

def explain_additives(additive_tags: List[str]) -> List[Dict[str, str]]:
    """
    Converts Open Food Facts En-tags (e.g., 'en:e330') into plain English explanations.
    """
    if not additive_tags:
        return []
    
    explanations = []
    for tag in additive_tags:
        # tag formatted like 'en:e330' -> extract 'E330'
        parts = tag.split(":")
        if len(parts) == 2:
            code = parts[1].upper()
            if code in ADDITIVES_DICT:
                explanations.append({"code": code, "explanation": ADDITIVES_DICT[code]})
            else:
                explanations.append({"code": code, "explanation": "Unknown additive"})
    return explanations

def calculate_health_score(nova_group: int, nutri_score: str, flagged_count: int) -> str:
    """
    Determines a simple Green/Yellow/Red traffic light score.
    Uses a combination of NOVA (processed level), Nutri-Score, and flagged ingredients.
    """
    if nova_group == 4 or nutri_score in ['e'] or flagged_count > 3:
        return "Red"
    elif nova_group == 3 or nutri_score in ['c', 'd'] or flagged_count > 0:
        return "Yellow"
    elif nova_group in [1, 2] or nutri_score in ['a', 'b']:
        return "Green"
    else:
        return "Unknown"
