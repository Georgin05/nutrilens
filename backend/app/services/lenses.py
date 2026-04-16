from typing import Dict, List, Any
import json
from app.models.models import CustomLens

def evaluate_food_by_lens(product_data: Dict[str, Any], lens: CustomLens) -> Dict[str, Any]:
    """
    Evaluates a product and generates a specific score, warnings, and advice 
    based on the selected health lens.
    
    lens is a CustomLens fetched from the database, which has macro ratios,
    calorie modifiers, and item limits.
    """
    
    # Extract baseline product data safely
    calories = float(product_data.get('calories') or 0.0)
    protein = float(product_data.get('protein_g') or 0.0)
    carbs = float(product_data.get('carbs_g') or 0.0)
    sugar = float(product_data.get('sugar_g') or 0.0)
    fiber = float(product_data.get('fiber_g') or 0.0)
    fat = float(product_data.get('fat_g') or 0.0)
    
    # Flags and processed marks
    flagged_ingredients = product_data.get('flagged_ingredients', [])
    processed_level = product_data.get('processed_level', 2) # NOVA score 1-4
    
    # Baseline Score (Starts at 100)
    score = 100
    warnings = []
    advice_lines = []
    
    # Analyze Macros
    total_macros_g = protein + carbs + fat
    if total_macros_g > 0:
        actual_protein_ratio = protein / total_macros_g
        actual_carb_ratio = carbs / total_macros_g
        actual_fat_ratio = fat / total_macros_g
        
        # Protein penalty or bonus based on target ratio
        if actual_protein_ratio < (lens.protein_ratio * 0.7):
            score -= 15
            warnings.append(f"Low protein for {lens.name} standards.")
        elif actual_protein_ratio >= lens.protein_ratio:
            score += 10
            advice_lines.append(f"Great protein source for {lens.name}.")
            
        # Carb penalty or bonus
        if actual_carb_ratio > (lens.carb_ratio * 1.5):
             score -= 10
             warnings.append(f"Carbs exceed ideal ratio for {lens.name}.")
        
        # Fat penalty
        if actual_fat_ratio > (lens.fat_ratio * 1.5):
             score -= 10
             warnings.append(f"Higher fat content than desired for {lens.name}.")

    # Evaluate Sugar & Fiber depending on Lens string if needed, or by target goals
    if lens.sugar_limit_g and sugar > lens.sugar_limit_g * 0.3: # Using 30% of daily limit for a single food item
        score -= 25
        warnings.append("High sugar relative to your goals.")
        
    if processed_level >= 3:
        score -= 15 if lens.name != 'Clean Eating' else 35
        warnings.append("Ultra processed.")
        
    # Custom Ingredient Guards (Checking intersection with parsed ingredients)
    if lens.flagged_ingredients_json:
        custom_guards = json.loads(lens.flagged_ingredients_json)
        product_ingredients = (product_data.get('ingredients') or '').lower()
        
        if custom_guards:
            tripped_guards = [g for g in custom_guards if g.lower() in product_ingredients]
            if tripped_guards:
                score -= (20 * len(tripped_guards)) # -20 per guard hit
                for g in tripped_guards:
                    warnings.append(f"Guard Triggered: Contains {g}.")
                advice_lines.append("This product contains ingredients you asked to avoid.")

    # Clamp score between 0 and 100
    final_score = max(0, min(100, score))
    
    # Generic advice if none generated
    if not advice_lines:
        if final_score > 70:
            advice_lines.append("This food aligns reasonably well with your selected lens.")
        else:
            advice_lines.append("This food does not align optimally with your selected lens goals.")

    return {
        "lens_id": lens.id if lens.id else lens.name,
        "score": final_score,
        "warnings": warnings,
        "advice": " ".join(advice_lines)
    }
