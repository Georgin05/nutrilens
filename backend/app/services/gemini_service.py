import google.generativeai as genai
from app.core.config import settings

def configure_gemini():
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set in environment variables.")
    genai.configure(api_key=settings.GEMINI_API_KEY)

def generate_ai_buddy_response(user_message: str, user_context: dict, chat_history: list) -> dict:
    configure_gemini()
    
    # Define the system prompt with context
    system_instruction = f"""
    You are the NutriLens AI Buddy, an expert, encouraging, and highly precise clinical nutritionist.
    You help users understand their metabolic health, provide guidance based on their daily logs and goals, and suggest meals.
    Be concise but informative. Speak in a friendly, supportive tone. Do not use Markdown formatting like **bold** unless necessary, keep it conversational.
    
    Current User Context:
    - User Goals: {user_context.get('profile', 'Unknown')}
    - Active Lens: {user_context.get('active_lens', 'Standard')}
    - Daily Logs Summary: {user_context.get('logs_summary', 'No logs today')}
    """
    
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash", 
        system_instruction=system_instruction
    )
    
    # Format chat history for Gemini (max last 10 messages)
    formatted_history = []
    recent_history = chat_history[-10:] if len(chat_history) > 10 else chat_history
    for msg in recent_history:
        role = "user" if msg.role == "user" else "model"
        formatted_history.append({"role": role, "parts": [msg.content]})
        
    try:
        chat = model.start_chat(history=formatted_history)
        response = chat.send_message(user_message)
        
        # Determine actionable triggers based on content
        data_payload = None
        text_lower = response.text.lower()
        if "protein" in text_lower:
             data_payload = {"type": "protein_tip"}
        elif "water" in text_lower or "hydration" in text_lower:
             data_payload = {"type": "hydration"}
             
        return {
            "reply": response.text,
            "data": data_payload
        }
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {
            "reply": "I'm having a little trouble connecting to my knowledge base right now. Please try again in a moment!",
            "data": None
        }
