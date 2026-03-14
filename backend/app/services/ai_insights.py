import os
from google import genai
from app.core.config import settings

def generate_weekly_insight(analytics_data: dict) -> str:
    """
    Generates a personalized health insight based on weekly logged data using Gemini.
    """
    
    total_logs = sum(len(logs) for logs in analytics_data["logs_per_day"].values())
    if total_logs == 0:
        return "You haven't logged any items this week! Start scanning to get personalized insights."
        
    if not settings.GEMINI_API_KEY:
        return "Please set your GEMINI_API_KEY in the .env file to enable AI insights."
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = (
            f"You are NutriLens, an encouraging AI health assistant. "
            f"Write a short, personalized health insight (max 3 sentences) for a user who logged this data over the last 7 days: {analytics_data}. "
            f"Highlight positive trends or offer one constructive healthy swap suggestion."
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        print(f"Error generating insight with Gemini: {e}")
        return "Keep logging to build a better nutritional profile. (AI insight temporarily unavailable)"