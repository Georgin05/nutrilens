import sys
import os

backend_path = r"c:\Users\josht\OneDrive\Desktop\coding\nutrilens\backend"
if backend_path not in sys.path:
    sys.path.append(backend_path)

# Ensure environment variables are loaded if running directly
from dotenv import load_dotenv
load_dotenv(os.path.join(backend_path, '.env'))

from app.services.gemini_service import generate_ai_buddy_response

class MockMsg:
    def __init__(self, role, content):
        self.role = role
        self.content = content

user_context = {
    "profile": "Goal: Muscle Gain, Weight: 75.0kg",
    "active_lens": "Muscle Peak",
    "logs_summary": "Eaten today: 450 kcal, 32g protein."
}

try:
    res = generate_ai_buddy_response("What should I eat for dinner given my goal?", user_context, [])
    print("SUCCESS:")
    print(res)
except Exception as e:
    import traceback
    traceback.print_exc()
