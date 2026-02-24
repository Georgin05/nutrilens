from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import List, Dict, Any
from datetime import datetime, timedelta

from app.db.database import get_session
from app.models.models import User, Product, DailyLog
from app.api.deps import get_current_user
from app.services.analysis import calculate_health_score, parse_ingredients

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/weekly", response_model=Dict[str, Any])
def get_weekly_analytics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Get logs from the last 7 days
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)
    start_datetime = datetime(start_date.year, start_date.month, start_date.day)

    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_datetime
    )
    result = session.exec(statement).all()

    # Initialize a dictionary holding 7 days of 0s
    daily_stats = {}
    for i in range(7):
        d = start_date + timedelta(days=i)
        daily_stats[str(d)] = {
            "calories": 0.0,
            "protein_g": 0.0,
            "carbs_g": 0.0,
            "fat_g": 0.0
        }

    # Aggregate
    for log, product in result:
        log_date = str(log.timestamp.date())
        # Just in case there's a timezone boundary weirdness
        if log_date in daily_stats:
            daily_stats[log_date]["calories"] += (product.calories or 0.0) * log.serving_size
            daily_stats[log_date]["protein_g"] += (product.protein_g or 0.0) * log.serving_size
            daily_stats[log_date]["carbs_g"] += (product.carbs_g or 0.0) * log.serving_size
            daily_stats[log_date]["fat_g"] += (product.fat_g or 0.0) * log.serving_size

    # Format for Chart.js
    labels = list(daily_stats.keys())
    calories_data = [daily_stats[d]["calories"] for d in labels]
    protein_data = [daily_stats[d]["protein_g"] for d in labels]
    carbs_data = [daily_stats[d]["carbs_g"] for d in labels]
    fat_data = [daily_stats[d]["fat_g"] for d in labels]

    return {
        "labels": labels,
        "datasets": [
            {"label": "Calories (kcal)", "data": calories_data},
            {"label": "Protein (g)", "data": protein_data},
            {"label": "Carbs (g)", "data": carbs_data},
            {"label": "Fat (g)", "data": fat_data}
        ]
    }

@router.get("/pantry-audit", response_model=Dict[str, Any])
def get_pantry_audit(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """
    Evaluates the user's historical purchases (mocked by using all their logged past consumption)
    and breaks down the health grades.
    """
    # Grab distinct products the user has interacted with
    statement = select(Product).join(DailyLog).where(DailyLog.user_id == current_user.id).distinct()
    products = session.exec(statement).all()
    
    total_items = len(products)
    if total_items == 0:
        return {"total_items": 0, "breakdown": {"Green": 0, "Yellow": 0, "Red": 0}, "red_flagged_items": []}

    grade_counts = {"Green": 0, "Yellow": 0, "Red": 0, "Unknown": 0}
    red_items = []

    for product in products:
        flagged = parse_ingredients(product.ingredients)
        health_score = calculate_health_score(
            nova_group=product.processed_level or 0,
            nutri_score=product.nutri_score.lower() if product.nutri_score else "unknown",
            flagged_count=len(flagged)
        )
        
        grade_counts[health_score] += 1
        
        if health_score == "Red":
            red_items.append({
                "barcode": product.barcode,
                "name": product.name,
                "flagged_ingredients": [f["ingredient"] for f in flagged]
            })

    # Convert to percentages for donut charts
    percentages = {
        "Green": round((grade_counts["Green"] / total_items) * 100, 1),
        "Yellow": round((grade_counts["Yellow"] / total_items) * 100, 1),
        "Red": round((grade_counts["Red"] / total_items) * 100, 1),
    }

    return {
        "total_items": total_items,
        "breakdown": percentages,
        "counts": grade_counts,
        "red_flagged_items": red_items
    }
