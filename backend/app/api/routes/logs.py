from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, date

from app.db.database import get_session
from app.models.models import User, Product, DailyLog
from app.api.deps import get_current_user
from app.models.schemas import DailyLogCreate, DailyLogResponse, DailySummaryResponse

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.post("/consume", response_model=DailyLogResponse)
def log_consumption(
    log_in: DailyLogCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Check if this is a barcode scan or a custom entry
    if log_in.barcode:
        product = session.get(Product, log_in.barcode)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found in local catalog. Fetch it via /products/ first.")
        
        # Create the log entry from product data
        new_log = DailyLog(
            user_id=current_user.id,
            barcode=log_in.barcode,
            product_name=product.name,
            serving_size=log_in.serving_size,
            calories=(product.calories or 0.0) * log_in.serving_size,
            protein_g=(product.protein_g or 0.0) * log_in.serving_size,
            carbs_g=(product.carbs_g or 0.0) * log_in.serving_size,
            fat_g=(product.fat_g or 0.0) * log_in.serving_size,
            meal_type=log_in.meal_type or "Scan",
            timestamp=datetime.utcnow()
        )
    else:
        # Custom log from meal cart or manual entry
        new_log = DailyLog(
            user_id=current_user.id,
            product_name=log_in.product_name or "Custom Meal",
            serving_size=log_in.serving_size,
            calories=log_in.calories,
            protein_g=log_in.protein_g,
            carbs_g=log_in.carbs_g,
            fat_g=log_in.fat_g,
            meal_type=log_in.meal_type,
            timestamp=datetime.utcnow()
        )

    session.add(new_log)
    session.commit()
    session.refresh(new_log)

    return DailyLogResponse(
        id=new_log.id,
        user_id=new_log.user_id,
        barcode=new_log.barcode or "CUSTOM",
        product_name=new_log.product_name or "Unknown Item",
        serving_size=new_log.serving_size,
        calories=new_log.calories,
        protein_g=new_log.protein_g,
        carbs_g=new_log.carbs_g,
        fat_g=new_log.fat_g,
        timestamp=new_log.timestamp
    )

@router.get("/today", response_model=DailySummaryResponse)
def get_todays_logs(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Calculate start and end of today
    today = datetime.utcnow().date()
    start_of_day = datetime(today.year, today.month, today.day)
    
    # Query all logs for the user for today (no join, use DailyLog's stored macros)
    statement = select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    results = session.exec(statement).all()
    
    log_responses = []
    tot_cal = 0.0
    tot_pro = 0.0
    tot_carb = 0.0
    tot_fat = 0.0

    for log in results:
        tot_cal += log.calories
        tot_pro += log.protein_g
        tot_carb += log.carbs_g
        tot_fat += log.fat_g
        
        log_responses.append(DailyLogResponse(
            id=log.id,
            user_id=log.user_id,
            barcode=log.barcode or "CUSTOM",
            product_name=log.product_name or "Unknown Item",
            serving_size=log.serving_size,
            calories=log.calories,
            protein_g=log.protein_g,
            carbs_g=log.carbs_g,
            fat_g=log.fat_g,
            timestamp=log.timestamp
        ))
        
    return DailySummaryResponse(
        date=str(today),
        total_calories=tot_cal,
        total_protein_g=tot_pro,
        total_carbs_g=tot_carb,
        total_fat_g=tot_fat,
        logs=log_responses
    )
