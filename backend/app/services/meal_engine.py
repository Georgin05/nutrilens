import json
from typing import List, Dict
from sqlmodel import Session, select
from app.models.models import MealTemplate, MealPlan, User, CustomLens
from app.services.lens_engine import calculate_target_macros

def split_daily_target(daily_macros: Dict[str, float]) -> List[Dict[str, float]]:
    """Splits daily total into 4 meals: Breakfast (25%), Lunch (35%), Dinner (30%), Snack (10%)"""
    splits = [
        ("Breakfast", 0.25),
        ("Lunch", 0.35),
        ("Dinner", 0.30),
        ("Snack", 0.10)
    ]
    
    meal_targets = []
    for name, ratio in splits:
        meal_targets.append({
            "meal_type": name,
            "calories": daily_macros["calories"] * ratio,
            "protein_g": daily_macros["protein_g"] * ratio,
            "carbs_g": daily_macros["carbs_g"] * ratio,
            "fat_g": daily_macros["fat_g"] * ratio
        })
    return meal_targets

def score_meal_template(template: MealTemplate, target: Dict[str, float]) -> float:
    """Calculates a similarity score based on calorie and macro proximity"""
    # Simple weighted Euclidean distance
    cal_diff = abs(template.calories - target["calories"]) / (target["calories"] or 1)
    prot_diff = abs(template.protein_g - target["protein_g"]) / (target["protein_g"] or 1)
    carb_diff = abs(template.carbs_g - target["carbs_g"]) / (target["carbs_g"] or 1)
    fat_diff = abs(template.fat_g - target["fat_g"]) / (target["fat_g"] or 1)
    
    # Weigh calories and protein more heavily for matching
    return (cal_diff * 2) + (prot_diff * 2) + carb_diff + fat_diff

def generate_weekly_plan(session: Session, user: User):
    # 1. Get user targets
    lens = session.get(CustomLens, user.active_lens_id)
    if not lens:
        return None
        
    daily_macros = calculate_target_macros(user, lens)
    meal_targets = split_daily_target(daily_macros)
    
    # 2. Get all available templates
    templates = session.exec(select(MealTemplate)).all()
    if not templates:
        return None
        
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    # 3. Clear existing plan
    existing_plans = session.exec(select(MealPlan).where(MealPlan.user_id == user.id)).all()
    for plan in existing_plans:
        session.delete(plan)
    
    # 4. Generate and save new plan
    for day in days:
        for target in meal_targets:
            # Filter templates by type
            type_templates = [t for t in templates if t.meal_type == target["meal_type"]]
            if not type_templates:
                continue
                
            # Pick best match
            best_match = min(type_templates, key=lambda t: score_meal_template(t, target))
            
            new_meal = MealPlan(
                user_id=user.id,
                day_of_week=day,
                meal_type=target["meal_type"],
                meal_template_id=best_match.id
            )
            session.add(new_meal)
    
    session.commit()
    return True

def get_aggregated_groceries(session: Session, user_id: int):
    # Get the plan
    statement = select(MealPlan, MealTemplate).join(MealTemplate).where(MealPlan.user_id == user_id)
    results = session.exec(statement).all()
    
    grocery_aggregation = {}
    
    for plan, template in results:
        items = json.loads(template.food_items_json)
        for item in items:
            # Handle both old format (plain strings) and new format (dicts)
            if isinstance(item, str):
                name = item
                qty = 1
                unit = "unit"
                category = "Other"
            else:
                name = item.get("name", str(item))
                qty = item.get("quantity", 1)
                unit = item.get("unit", "unit")
                category = item.get("category", "Other")
            
            key = f"{name}_{unit}"
            if key not in grocery_aggregation:
                grocery_aggregation[key] = {
                    "name": name,
                    "quantity": 0,
                    "unit": unit,
                    "category": category
                }
            grocery_aggregation[key]["quantity"] += qty
            
    return list(grocery_aggregation.values())

def smart_fill_day(session: Session, user: User, day_of_week: str):
    lens = session.get(CustomLens, user.active_lens_id)
    if not lens:
        return False

    daily_macros = calculate_target_macros(user, lens)
    
    # Get existing meals for the day
    statement = select(MealPlan, MealTemplate).join(MealTemplate).where(
        MealPlan.user_id == user.id, 
        MealPlan.day_of_week == day_of_week
    )
    results = session.exec(statement).all()
    
    existing_types = [plan.meal_type for plan, _ in results]
    current_cal, current_pro, current_carb, current_fat = 0.0, 0.0, 0.0, 0.0
    for _, template in results:
        current_cal += template.calories
        current_pro += template.protein_g
        current_carb += template.carbs_g
        current_fat += template.fat_g
        
    remaining_macros = {
        "calories": max(0, daily_macros["calories"] - current_cal),
        "protein_g": max(0, daily_macros["protein_g"] - current_pro),
        "carbs_g": max(0, daily_macros["carbs_g"] - current_carb),
        "fat_g": max(0, daily_macros["fat_g"] - current_fat),
    }
    
    if remaining_macros["calories"] < 100:
        return True # Not enough calories left to bother
        
    splits = [("Breakfast", 0.25), ("Lunch", 0.35), ("Dinner", 0.30), ("Snack", 0.10)]
    missing_splits = [s for s in splits if s[0] not in existing_types]
    if not missing_splits:
        return True # Day already full
        
    total_missing_ratio = sum([s[1] for s in missing_splits])
    
    templates = session.exec(select(MealTemplate)).all()
    
    for name, ratio in missing_splits:
        normalized_ratio = ratio / total_missing_ratio
        target = {
            "meal_type": name,
            "calories": remaining_macros["calories"] * normalized_ratio,
            "protein_g": remaining_macros["protein_g"] * normalized_ratio,
            "carbs_g": remaining_macros["carbs_g"] * normalized_ratio,
            "fat_g": remaining_macros["fat_g"] * normalized_ratio
        }
        
        type_templates = [t for t in templates if t.meal_type == name]
        if not type_templates:
            continue
            
        best_match = min(type_templates, key=lambda t: score_meal_template(t, target))
        new_meal = MealPlan(
            user_id=user.id,
            day_of_week=day_of_week,
            meal_type=name,
            meal_template_id=best_match.id
        )
        session.add(new_meal)
        
    session.commit()
    return True

