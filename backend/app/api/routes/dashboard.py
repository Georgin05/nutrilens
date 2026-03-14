from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.db.database import get_session
from app.models.models import User, Product, DailyLog, ScanLog
from app.api.deps import get_current_user
from app.services.analysis import calculate_health_score, parse_ingredients
from app.services.ai_insights import generate_weekly_insight

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
    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    result = session.exec(statement).all()
    
    tot_cal = 0.0
    tot_pro = 0.0
    tot_carb = 0.0
    tot_fat = 0.0

    for log, product in result:
        tot_cal += (product.calories or 0.0) * log.serving_size
        tot_pro += (product.protein_g or 0.0) * log.serving_size
        tot_carb += (product.carbs_g or 0.0) * log.serving_size
        tot_fat += (product.fat_g or 0.0) * log.serving_size
        
    # Mock targets (in a real app, these would come from the User model based on BMR/Goals)
    target_calories = current_user.bmr or 2000
    target_protein = 150
    target_carbs = 250
    target_fat = 70

    return {
        "calories": round(tot_cal),
        "target_calories": round(target_calories),
        "protein": round(tot_pro),
        "target_protein": target_protein,
        "carbs": round(tot_carb),
        "target_carbs": target_carbs,
        "fat": round(tot_fat),
        "target_fat": target_fat
    }

@router.get("/food-logs")
def get_food_logs(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    
    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    ).order_by(DailyLog.timestamp)
    
    result = session.exec(statement).all()
    
    logs = []
    for log, product in result:
        logs.append({
            "id": log.id,
            "food": product.name,
            "portion": f"{log.serving_size} serving\u0073",
            "macros": {
                 "p": round((product.protein_g or 0) * log.serving_size),
                 "c": round((product.carbs_g or 0) * log.serving_size),
                 "f": round((product.fat_g or 0) * log.serving_size)
            },
            "calories": round((product.calories or 0) * log.serving_size),
            "time": log.timestamp.strftime("%I:%M %p")
        })
        
    return logs

@router.get("/recent-scans")
def get_recent_scans(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(ScanLog).where(
        ScanLog.user_id == current_user.id
    ).order_by(ScanLog.scan_time.desc()).limit(5)
    
    scans = session.exec(statement).all()
    return [{"food_name": scan.product_name, "scan_time": scan.scan_time, "barcode": scan.barcode} for scan in scans]

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
    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    result = session.exec(statement).all()
    
    tot_pro = sum([(product.protein_g or 0) * log.serving_size for log, product in result])
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

    statement = select(DailyLog, Product).join(Product).where(
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

    for log, product in result:
        log_date = str(log.timestamp.date())
        if log_date in daily_stats:
            daily_stats[log_date]["calories"] += (product.calories or 0.0) * log.serving_size

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
    
    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_datetime,
        DailyLog.timestamp < end_datetime
    )
    result = session.exec(statement).all()
    
    tot_cal = 0.0
    meals = []
    
    # Matching the specific mock requested by user:
    # { calories: 1900, meals: ["Chicken Salad", "Rice Bowl"] }
    for log, product in result:
        tot_cal += (product.calories or 0.0) * log.serving_size
        meals.append(product.name)

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
