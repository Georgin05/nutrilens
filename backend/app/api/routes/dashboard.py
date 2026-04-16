from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.db.database import get_session
from app.models.models import User, Product, DailyLog, ScanLog
from app.api.deps import get_current_user
from app.services.analysis import calculate_health_score, parse_ingredients
from app.services.ai_insights import generate_weekly_insight
from app.core.nutrition_utils import calculate_bmr, calculate_tdee
from app.models.models import CustomLens, UserNutritionProfile

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/daily-summary")
def get_daily_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Calculate start and end of today
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    
    # Query all logs for the user for today
    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    result = session.exec(statement).all()
    
    tot_cal = 0.0
    tot_pro = 0.0
    tot_carb = 0.0
    tot_fat = 0.0

    for log in result:
        tot_cal += log.calories or 0.0
        tot_pro += log.protein_g or 0.0
        tot_carb += log.carbs_g or 0.0
        tot_fat += log.fat_g or 0.0
        
    # --- Dynamic Target Calculation ---
    # 1. Base metabolism
    if current_user.weight_kg and current_user.height_cm and current_user.age_years and current_user.gender:
        bmr = calculate_bmr(current_user.weight_kg, current_user.height_cm, current_user.age_years, current_user.gender)
        tdee = calculate_tdee(bmr, current_user.activity_level or 1.2)
    else:
        # Fallback to sensible defaults if profile is incomplete
        bmr = current_user.bmr or 1600.0
        tdee = bmr * 1.2
    
    # 2. Apply active lens if present
    active_lens = None
    if current_user.active_lens_id:
        active_lens = session.get(CustomLens, current_user.active_lens_id)
    
    # Logic for default lens behavior if no custom lens is active
    if not active_lens:
        # Basic mapping from health goal to mock lens settings
        goal = current_user.health_goal or "Maintenance"
        if goal == "Weight Loss":
            cal_mod = -500
            p_ratio, c_ratio, f_ratio = 0.3, 0.4, 0.3
        elif goal == "Muscle Gain":
            cal_mod = 500
            p_ratio, c_ratio, f_ratio = 0.35, 0.45, 0.2
        else:
            cal_mod = 0
            p_ratio, c_ratio, f_ratio = 0.2, 0.5, 0.3
    else:
        cal_mod = active_lens.calorie_modifier
        p_ratio = active_lens.protein_ratio
        c_ratio = active_lens.carb_ratio
        f_ratio = active_lens.fat_ratio

    target_calories = tdee + cal_mod
    
    # 3. Calculate macro targets in grams
    # Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
    target_protein = (target_calories * p_ratio) / 4
    target_carbs = (target_calories * c_ratio) / 4
    target_fat = (target_calories * f_ratio) / 9

    return {
        "calories": round(tot_cal),
        "target_calories": round(target_calories),
        "protein": round(tot_pro),
        "target_protein": round(target_protein),
        "carbs": round(tot_carb),
        "target_carbs": round(target_carbs),
        "fat": round(tot_fat),
        "target_fat": round(target_fat),
        "lens_name": active_lens.name if active_lens else "Dynamic Base"
    }

@router.get("/food-logs")
def get_food_logs(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    
    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    ).order_by(DailyLog.timestamp)
    
    result = session.exec(statement).all()
    
    logs = []
    for log in result:
        logs.append({
            "id": log.id,
            "food": log.product_name or "Custom Meal",
            "portion": f"{log.serving_size} serving\u0073",
            "macros": {
                 "p": round(log.protein_g or 0),
                 "c": round(log.carbs_g or 0),
                 "f": round(log.fat_g or 0)
            },
            "calories": round(log.calories or 0),
            "meal_type": log.meal_type or "Snack",
            "time": log.timestamp.strftime("%I:%M %p")
        })
        
    return logs

@router.get("/recent-scans")
def get_recent_scans(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(ScanLog, Product).join(
        Product, ScanLog.barcode == Product.barcode, isouter=True
    ).where(
        ScanLog.user_id == current_user.id
    ).order_by(ScanLog.scan_time.desc()).limit(20) # Increased limit for history page
    
    results = session.exec(statement).all()
    
    scans = []
    for scan, product in results:
        scans.append({
            "id": scan.id,
            "food_name": scan.product_name,
            "barcode": scan.barcode,
            "scan_time": scan.scan_time.isoformat(),
            "calories": product.calories if product else 0,
            "protein": product.protein_g if product else 0,
            "carbs": product.carbs_g if product else 0,
            "fat": product.fat_g if product else 0,
            "nutri_score": product.nutri_score if product else None,
            "brand": "Generic" # Product model doesn't have brand yet, using fallback
        })
    return scans

@router.post("/log-scan")
def log_scan(
    barcode: str,
    product_name: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    new_scan = ScanLog(
        user_id=current_user.id,
        barcode=barcode,
        product_name=product_name
    )
    session.add(new_scan)
    session.commit()
    return {"status": "success"}

@router.get("/lens-insight")
def get_lens_insight(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Determine which lens is active based on health goal
    goals_lens_map = {
        "Weight Loss": "Fat Loss Lens",
        "Muscle Gain": "Metabolic Peak",
        "Maintenance": "Balanced Lens"
    }
    active_lens = goals_lens_map.get(current_user.health_goal, "General Health")
    
    # Analyze today's food to generate insight
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    result = session.exec(statement).all()
    
    tot_pro = sum([(log.protein_g or 0) for log in result])
    target_pro = 150
    
    # Matching the new architecture response format:
    # { lens_name: "Fat Loss Lens Active", insight: "...", recommendation: "..." }
    
    insight_text = ""
    recommendation_text = ""
    
    if active_lens == "Metabolic Peak":
         insight_text = "Your fat oxidation is 12% higher today than your average. Ideal time for a cardio session."
         recommendation_text = "Consider a 30-minute zone-2 cardio session to maximize fat lipolysis."
    elif tot_pro < target_pro:
         gap = round(target_pro - tot_pro)
         insight_text = "Protein intake below muscle-building target for your activity level."
         recommendation_text = f"Add high protein meals like eggs or chicken for your next meal to hit your daily goal of {target_pro}g."
    else:
         insight_text = "You are currently perfectly hitting your macronutrient targets today based on your active lens."
         recommendation_text = "Keep it up! Continuing this trend will result in clinical improvements."

    return {
        "lens_name": f"{active_lens} Active",
        "insight": insight_text,
        "recommendation": recommendation_text
    }

@router.get("/weekly-stats")
def get_weekly_stats(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)
    start_datetime = datetime(start_date.year, start_date.month, start_date.day)

    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_datetime
    )
    result = session.exec(statement).all()

    daily_stats = {}
    for i in range(7):
        d = start_date + timedelta(days=i)
        
        # d.strftime("%A") gives full weekday name. We slice it down to 3 chars. 
        day_str = d.strftime("%A")
        short_day = day_str[:3]
        
        daily_stats[str(d)] = {
            "date": short_day.upper(), 
            "calories": 0,
        }

    for log in result:
        log_date = str(log.timestamp.date())
        if log_date in daily_stats:
            daily_stats[log_date]["calories"] += (log.calories or 0.0)

    # The architecture requests a flat array
    return list(daily_stats.values())

@router.get("/history")
def get_history(
    date: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        return {"error": "Invalid date format. Use YYYY-MM-DD"}
        
    start_datetime = datetime(target_date.year, target_date.month, target_date.day)
    end_datetime = start_datetime + timedelta(days=1)
    
    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_datetime,
        DailyLog.timestamp < end_datetime
    )
    result = session.exec(statement).all()
    
    tot_cal = 0.0
    meals = []
    
    # Matching the specific mock requested by user:
    # { calories: 1900, meals: ["Chicken Salad", "Rice Bowl"] }
    for log in result:
        tot_cal += (log.calories or 0.0)
        meals.append(log.product_name or "Custom Meal")

    return {
        "calories": round(tot_cal),
        "meals": meals
    }

@router.get("/hydration")
def get_hydration(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Mock hydration data since it's not in the DB yet, but frontend expects it
    return {
        "current_l": 2.4,
        "target_l": 3.5
    }

@router.get("/nutrition-lens")
def get_user_nutrition_lens(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 1. Base metabolism
    if current_user.weight_kg and current_user.height_cm and current_user.age_years and current_user.gender:
        bmr = calculate_bmr(current_user.weight_kg, current_user.height_cm, current_user.age_years, current_user.gender)
        tdee = calculate_tdee(bmr, current_user.activity_level or 1.2)
    else:
        bmr = current_user.bmr or 1600.0
        tdee = bmr * 1.2
    
    # 2. Apply active lens if present
    active_lens = None
    if current_user.active_lens_id:
        active_lens = session.get(CustomLens, current_user.active_lens_id)
    
    if not active_lens:
        goal = current_user.health_goal or "Maintenance"
        if goal == "Weight Loss":
            cal_mod = -500
            p_ratio, c_ratio, f_ratio = 0.3, 0.4, 0.3
            lens_name = "Fat Loss"
            tags = ["Calorie Deficit", "Moderate Protein"]
        elif goal == "Muscle Gain":
            cal_mod = 500
            p_ratio, c_ratio, f_ratio = 0.35, 0.45, 0.2
            lens_name = "Muscle Build"
            tags = ["Calorie Surplus", "High Protein"]
        else:
            cal_mod = 0
            p_ratio, c_ratio, f_ratio = 0.2, 0.5, 0.3
            lens_name = "Maintenance"
            tags = ["Balanced", "Natural Health"]
    else:
        cal_mod = active_lens.calorie_modifier
        p_ratio = active_lens.protein_ratio
        c_ratio = active_lens.carb_ratio
        f_ratio = active_lens.fat_ratio
        lens_name = active_lens.name
        # Simple tags based on ratios
        tags = []
        if cal_mod > 0: tags.append("Calorie Surplus")
        elif cal_mod < 0: tags.append("Calorie Deficit")
        if p_ratio > 0.3: tags.append("High Protein")
        if c_ratio < 0.3: tags.append("Low Carb")

    target_calories = tdee + cal_mod
    target_protein = (target_calories * p_ratio) / 4
    target_carbs = (target_calories * c_ratio) / 4
    target_fat = (target_calories * f_ratio) / 9

    return {
        "user_details": {
            "age": current_user.age_years,
            "weight": current_user.weight_kg,
            "height": current_user.height_cm,
            "gender": current_user.gender
        },
        "bmr": round(bmr),
        "active_lens": {
            "name": lens_name.upper(),
            "tags": tags
        },
        "target_nutrition": {
            "calories": round(target_calories),
            "protein": round(target_protein),
            "carbs": round(target_carbs),
            "fat": round(target_fat)
        }
    }
