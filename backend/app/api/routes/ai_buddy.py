from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
import json

from app.db.database import get_session
from app.api.deps import get_current_user
from app.models.models import User, CustomLens, DailyLog, AIChatHistory
from app.services.gemini_service import generate_ai_buddy_response

router = APIRouter()

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    data: Optional[dict] = None

class MealAnalysisResponse(BaseModel):
    food: str
    protein: float
    carbs: float
    fats: float
    calories: float
    message: str

@router.post("/chat", response_model=ChatResponse)
async def ai_buddy_chat(
    chat: ChatMessage, 
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Retrieve user context
    lens = session.get(CustomLens, current_user.active_lens_id) if current_user.active_lens_id else None
    lens_name = lens.name if lens else "Standard Calorie Tracking"
    
    # Calculate daily logs summary
    from datetime import datetime
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    logs = session.exec(select(DailyLog).where(
        DailyLog.user_id == current_user.id,
        DailyLog.timestamp >= today_start
    )).all()
    
    total_cals = sum([l.calories for l in logs])
    total_protein = sum([l.protein_g for l in logs])
    
    user_context = {
        "profile": f"Goal: {current_user.health_goal}, Weight: {current_user.weight_kg}kg",
        "active_lens": f"{lens_name} (Focusing on specific macros and exclusions)",
        "logs_summary": f"Eaten today: {total_cals:.0f} kcal, {total_protein:.0f}g protein."
    }
    
    # Retrieve chat history
    history = session.exec(
        select(AIChatHistory)
        .where(AIChatHistory.user_id == current_user.id)
        .order_by(AIChatHistory.timestamp.asc())
    ).all()
    
    # Generate Gemini Response
    response_data = generate_ai_buddy_response(chat.message, user_context, history)
    
    # Save the interaction to the database
    user_msg_log = AIChatHistory(user_id=current_user.id, role="user", content=chat.message)
    session.add(user_msg_log)
    
    ai_msg_log = AIChatHistory(user_id=current_user.id, role="ai", content=response_data["reply"])
    session.add(ai_msg_log)
    
    session.commit()
    
    return response_data

@router.get("/history")
async def get_chat_history(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    history = session.exec(
        select(AIChatHistory)
        .where(AIChatHistory.user_id == current_user.id)
        .order_by(AIChatHistory.timestamp.asc())
    ).all()
    return [{"role": h.role, "content": h.content, "timestamp": h.timestamp.isoformat()} for h in history]

@router.post("/analyze-meal", response_model=MealAnalysisResponse)
async def analyze_meal():
    return {
        "food": "Grilled Chicken Salad with Avocado",
        "protein": 32,
        "carbs": 12,
        "fats": 18,
        "calories": 450,
        "message": "Excellent choice! This meal has a great macro balance for your active lens."
    }

@router.get("/recommendations")
async def get_recommendations():
    return [
        {
            "title": "Dinner Insight",
            "content": "Focus on complex carbs like quinoa tonight to balance your afternoon levels.",
            "type": "insight"
        },
        {
            "title": "Hydration Goal",
            "content": "You are 500ml behind your water intake target. Grab a glass now!",
            "type": "hydration"
        },
        {
            "title": "Supplements",
            "content": "High training load detected. Magnesium intake recommended before sleep.",
            "type": "supplement"
        }
    ]
