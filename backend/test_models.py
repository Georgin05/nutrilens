import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv(r"c:\Users\josht\OneDrive\Desktop\coding\nutrilens\backend\.env")
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    print("Models supporting generateContent:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print("Error:", e)
