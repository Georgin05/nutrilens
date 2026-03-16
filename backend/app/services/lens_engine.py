from app.models.models import CustomLens, UserNutritionProfile
from app.services.nutrition import calculate_macros

def get_daily_target(nutrition_profile: UserNutritionProfile, lens: CustomLens):
    daily_calories = nutrition_profile.tdee + lens.calorie_modifier
    
    # Calculate macros
    macros = calculate_macros(
        daily_calories, 
        lens.protein_ratio, 
        lens.carb_ratio, 
        lens.fat_ratio
    )
    
    return {
        "calories": daily_calories,
        "protein_g": macros["protein_g"],
        "carbs_g": macros["carbs_g"],
        "fat_g": macros["fat_g"],
        "sugar_limit_g": lens.sugar_limit
    }
