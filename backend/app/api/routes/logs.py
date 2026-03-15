from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, date

from app.db.database import get_session
from app.models.models import User, Product, DailyLog
from app.api.deps import get_current_user
from app.models.schemas import DailyLogCreate, DailyLogResponse, DailySummaryResponse
from app.services.admin_activity_service import log_activity

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.post("/consume", response_model=DailyLogResponse)
def log_consumption(
    log_in: DailyLogCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Check if the product exists in the DB (it should have been fetched/cached via /products/ first)
    product = session.get(Product, log_in.barcode)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in local catalog. Fetch it via /products/ first.")

    # Create the log entry
    new_log = DailyLog(
        user_id=current_user.id,
        barcode=log_in.barcode,
        serving_size=log_in.serving_size,
        timestamp=datetime.utcnow()
    )
    session.add(new_log)
    log_activity(
        session=session,
        user_id=current_user.id,
        action="consume",
        target=product.name,
        metadata={"barcode": log_in.barcode, "serving_size": log_in.serving_size},
        commit=False,
    )
    session.commit()
    session.refresh(new_log)

    # Return with dynamically calculated macros per serving
    return DailyLogResponse(
        id=new_log.id,
        user_id=new_log.user_id,
        barcode=new_log.barcode,
        product_name=product.name,
        serving_size=new_log.serving_size,
        calories=(product.calories or 0.0) * new_log.serving_size,
        protein_g=(product.protein_g or 0.0) * new_log.serving_size,
        carbs_g=(product.carbs_g or 0.0) * new_log.serving_size,
        fat_g=(product.fat_g or 0.0) * new_log.serving_size,
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
    
    # Query all logs for the user for today
    statement = select(DailyLog, Product).join(Product).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= start_of_day
    )
    result = session.exec(statement).all()
    
    log_responses = []
    tot_cal = 0.0
    tot_pro = 0.0
    tot_carb = 0.0
    tot_fat = 0.0

    for log, product in result:
        cal = (product.calories or 0.0) * log.serving_size
        pro = (product.protein_g or 0.0) * log.serving_size
        carb = (product.carbs_g or 0.0) * log.serving_size
        fat = (product.fat_g or 0.0) * log.serving_size
        
        tot_cal += cal
        tot_pro += pro
        tot_carb += carb
        tot_fat += fat
        
        log_responses.append(DailyLogResponse(
            id=log.id,
            user_id=log.user_id,
            barcode=log.barcode,
            product_name=product.name,
            serving_size=log.serving_size,
            calories=cal,
            protein_g=pro,
            carbs_g=carb,
            fat_g=fat,
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
