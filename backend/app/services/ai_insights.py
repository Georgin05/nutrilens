import os
# Mocking out the genai dependency for the demo
# from google import genai
from app.core.config import settings

def generate_weekly_insight(analytics_data: dict) -> str:
    """
    Mocked version of weekly insight generation to avoid dependency issues during demo.
    """
    total_logs = sum(len(logs) for logs in analytics_data["logs_per_day"].values())
    if total_logs == 0:
        return "You haven't logged any items this week! Start scanning to get personalized insights."
    
    return "Great job staying active this week! Your protein intake is 15% higher than last week. Consider adding more fiber to your lunch to stay balanced."