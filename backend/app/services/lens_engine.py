from app.models.models import CustomLens, UserNutritionProfile, User
from app.services.nutrition import calculate_macros, calculate_bmr, calculate_tdee

def calculate_target_macros(user: User, lens: CustomLens):
    """Calculates daily target macros based on user profile and active lens."""
    # 1. Get BMR
    bmr = calculate_bmr(
        weight_kg=user.weight_kg or 70.0,
        height_cm=user.height_cm or 170.0,
        age_years=user.age_years or 30,
        gender=user.gender or "Male"
    )
    
    # 2. Get TDEE using activity_level (which is a multiplier)
    # Note: nutrition.py uses activity_level as a string literal to look up in a dict, 
    # but the User model's activity_level is already a float multiplier.
    # We'll just multiply directly if it's a float.
    tdee = bmr * (user.activity_level or 1.2)
    
    # 3. Apply lens modifier
    daily_calories = tdee + lens.calorie_modifier
    
    # 4. Calculate macros
    macros = calculate_macros(
        daily_calories, 
        lens.protein_ratio, 
        carb_ratio=lens.carb_ratio, 
        fat_ratio=lens.fat_ratio
    )
    
    return {
        "calories": daily_calories,
        "protein_g": macros["protein_g"],
        "carbs_g": macros["carbs_g"],
        "fat_g": macros["fat_g"],
        "sugar_limit_g": lens.sugar_limit_g
    }

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
        "sugar_limit_g": lens.sugar_limit_g
    }
