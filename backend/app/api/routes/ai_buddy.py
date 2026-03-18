from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time
import random

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
async def ai_buddy_chat(chat: ChatMessage):
    msg = chat.message.lower()
    
    # Simulate processing delay
    time.sleep(1) 

    if "protein" in msg:
        return {
            "reply": "You're about 45g short of your protein goal. Consider a snack like Greek yogurt or almonds.",
            "data": {"type": "protein_tip", "gap": 45}
        }
    
    if "lunch" in msg or "breakfast" in msg or "dinner" in msg:
        return {
            "reply": "Excellent choice! Based on your current progress, I recommend keeping it lean. How about a grilled chicken salad?",
            "data": {"suggestion": "Grilled Chicken Salad"}
        }

    if "analyze" in msg or "last meal" in msg:
        return {
            "reply": "Analyzing your last logged meal... It looks like you had a good balance of macros, but slightly high on sodium.",
            "data": {"analysis": "Sodium alert"}
        }

    if "water" in msg or "hydration" in msg:
        return {
            "reply": "You are 500ml behind your water intake target. Grab a glass now!",
            "data": {"hydration_gap": 500}
        }

    return {
        "reply": "I'm monitoring your metabolic health. You're doing well today! Is there anything specific you'd like to check?",
        "data": None
    }

@router.post("/analyze-meal", response_model=MealAnalysisResponse)
async def analyze_meal():
    # Simulate AI Vision delay
    time.sleep(2)
    
    return {
        "food": "Grilled Chicken Salad with Avocado",
        "protein": 32,
        "carbs": 12,
        "fats": 18,
        "calories": 450,
        "message": "Excellent choice! This meal has a great macro balance for your Muscle Peak lens."
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
