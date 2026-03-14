from typing import Dict, List, Any
import json
from app.models.models import CustomLens

def evaluate_food_by_lens(product_data: Dict[str, Any], lens_id: str, custom_lenses: List[CustomLens] = []) -> Dict[str, Any]:
    """
    Evaluates a product and generates a specific score, warnings, and advice 
    based on the selected health lens.
    
    lens_id can be a preset ('muscle_build', 'fat_loss', 'diabetes_friendly', 
    'athlete_performance', 'clean_eating') OR a stringified integer ID of a CustomLens.
    """
    
    # Extract baseline product data safely
    calories = float(product_data.get('calories') or 0.0)
    protein = float(product_data.get('protein_g') or 0.0)
    carbs = float(product_data.get('carbs_g') or 0.0)
    sugar = float(product_data.get('sugar_g') or 0.0) # Assume extraction if exists, else 0
    fiber = float(product_data.get('fiber_g') or 0.0)
    fat = float(product_data.get('fat_g') or 0.0)
    
    # Flags and processed marks from previous pipeline
    flagged_ingredients = product_data.get('flagged_ingredients', [])
    processed_level = product_data.get('processed_level', 2) # NOVA score 1-4
    
    # Baseline Score (Starts at 100)
    score = 100
    warnings = []
    advice_lines = []
    
    # ----------------------------------------------------
    # 1. Preset: Muscle Build Lens
    # ----------------------------------------------------
    if lens_id == 'muscle_build':
        # Rewards High Protein & Calories
        if protein > 15:
            score += 15
            advice_lines.append("High protein content supports muscle recovery.")
        elif protein < 5:
            score -= 20
            warnings.append("Low protein.")
            
        if calories > 300:
            advice_lines.append("Provides sufficient calories for training energy.")
        elif calories < 100:
            score -= 10
            warnings.append("Low calorie intake for muscle gain.")
            
        # Light penalty for sugar
        if sugar > 15:
            score -= 10
            warnings.append("Elevated sugar.")
            
    # ----------------------------------------------------
    # 2. Preset: Fat Loss Lens
    # ----------------------------------------------------
    elif lens_id == 'fat_loss':
        # Penalizes high calories and sugar heavily
        if calories > 400:
            score -= 30
            warnings.append("High calorie density.")
            advice_lines.append("Not suitable for fat loss diets.")
        elif calories < 150:
            score += 10
            advice_lines.append("Low calorie density, great for fat loss.")
            
        if sugar > 10:
            score -= 30
            warnings.append("High sugar.")
            
        if processed_level >= 3:
            score -= 15
            warnings.append("Ultra processed.")
            
        if fiber > 5:
            score += 15
            advice_lines.append("High fiber will help keep you full.")

    # ----------------------------------------------------
    # 3. Preset: Diabetes Friendly Lens
    # ----------------------------------------------------
    elif lens_id == 'diabetes_friendly':
        if sugar > 5:
            score -= 50
            warnings.append("High sugar.")
            advice_lines.append("High sugar content may increase blood glucose levels. Not recommended for diabetic diets.")
        
        if carbs > 30 and fiber < 3:
            score -= 20
            warnings.append("High glycemic carbohydrates without fiber.")
            
        if fiber >= 5:
            score += 20
            advice_lines.append("Excellent fiber content slows sugar absorption.")

    # ----------------------------------------------------
    # 4. Preset: Athlete Performance Lens
    # ----------------------------------------------------
    elif lens_id == 'athlete_performance':
        if carbs > 20:
            score += 15
            advice_lines.append("Provides quick carbohydrates for endurance performance.")
        else:
            score -= 20
            warnings.append("Low carbohydrates for endurance activity.")
            
        if protein > 10:
            score += 10
            advice_lines.append("Good baseline protein for recovery.")

    # ----------------------------------------------------
    # 5. Preset: Clean Eating Lens
    # ----------------------------------------------------
    elif lens_id == 'clean_eating':
        if processed_level >= 3:
            score -= 40
            warnings.append("Ultra processed food.")
            advice_lines.append("Highly processed food; not aligned with clean eating principles.")
        else:
            score += 20
            advice_lines.append("Minimally processed, whole food.")
            
        if flagged_ingredients:
            score -= 30
            warnings.append("Artificial preservatives/additives detected.")

    # ----------------------------------------------------
    # 6. Custom Lenses (Created by User in Wizard)
    # ----------------------------------------------------
    else:
        # Check if the lens_id matches a custom lens ID
        matching_custom_lens = next((cl for cl in custom_lenses if str(cl.id) == str(lens_id)), None)
        
        if matching_custom_lens:
            # Apply dynamic custom rules
            
            # Calorie Ceiling
            if matching_custom_lens.calorie_limit:
                # We calculate density based roughly on 100g or 1 serving
                if calories > matching_custom_lens.calorie_limit * 0.3: # If one item is >30% of daily
                    score -= 30
                    warnings.append(f"Exceeds relative calorie density for your {matching_custom_lens.calorie_limit} limit.")
            
            # Minimum Protein
            if matching_custom_lens.min_protein_g and protein < matching_custom_lens.min_protein_g:
                score -= 25
                warnings.append(f"Fails minimum protein requirement ({protein}g < {matching_custom_lens.min_protein_g}g).")
            elif matching_custom_lens.min_protein_g and protein >= matching_custom_lens.min_protein_g:
                score += 15
                advice_lines.append(f"Meets your high protein target of {matching_custom_lens.min_protein_g}g.")
                
            # Maximum Sugar
            if matching_custom_lens.max_sugar_g and sugar > matching_custom_lens.max_sugar_g:
                score -= 35
                warnings.append(f"Fails maximum sugar requirement ({sugar}g > {matching_custom_lens.max_sugar_g}g).")
                
            # Custom Ingredient Guards (Checking intersection with parsed ingredients)
            if matching_custom_lens.flagged_ingredients_json:
                custom_guards = json.loads(matching_custom_lens.flagged_ingredients_json)
                product_ingredients = (product_data.get('ingredients') or '').lower()
                
                tripped_guards = [g for g in custom_guards if g.lower() in product_ingredients]
                if tripped_guards:
                    score -= (20 * len(tripped_guards)) # -20 per guard hit
                    for g in tripped_guards:
                        warnings.append(f"Guard Triggered: Contains {g}.")
                    advice_lines.append("This product contains ingredients you specifically asked to avoid.")
        else:
             advice_lines.append("Lens not recognized. Defaulting to standard baseline.")

    # Clamp score between 0 and 100
    final_score = max(0, min(100, score))
    
    # Generic advice if none generated
    if not advice_lines:
        if final_score > 70:
            advice_lines.append("This food aligns reasonably well with your selected lens.")
        else:
            advice_lines.append("This food does not align optimally with your selected lens goals.")

    return {
        "lens_id": lens_id,
        "score": final_score,
        "warnings": warnings,
        "advice": " ".join(advice_lines)
    }
