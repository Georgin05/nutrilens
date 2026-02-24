# Project Management Document (PMD): NutriLens

## 1. Project Identification
**Project Name:** NutriLens  
**Project Objective:** A Full-Stack Health Application providing "X-ray vision" for groceries via barcode scanning, ingredient analysis, and personalized nutrition tracking.  
**Developer Profile:** BCA Final Year Student (Focus: Python, PostgreSQL, DSA)

---

## 2. Tech Stack & Infrastructure
* **Frontend:** React Native (Mobile Interface for Camera/Scanning)
* **Backend:** FastAPI (Python 3.10+)
* **Database:** PostgreSQL (Relational Data Persistence)
* **ORM:** SQLAlchemy or SQLModel
* **External API:** Open Food Facts API (Crowdsourced Food Database)
* **AI/ML:** Tesseract OCR (Optional label parsing) & Gemini/OpenAI API (Health Suggestions)

---

## 3. System Architecture & Modules

### **Module A: The Analysis Engine (Core)**
* **Barcode Scanner:** Integrates with mobile camera and laptop camera to fetch product metadata.
* **"Hidden Truth" Parser:** Python logic to identify ultra-processed ingredients and sneaky sugars.
* **Traffic Light System:** Algorithmic grading (Green/Yellow/Red) based on the NOVA food classification scale.
* **Additives Explainer:** Mapping E-numbers to plain-English health impacts.

### **Module B: Personalized Health Profiles**
* **User Management:** JWT-based authentication.
* **Dynamic Lenses:** Toggleable filters (Athlete, Diabetic, Gut Health, Allergy Radar).
* **BMR Calculator:** Python implementation of the Harris-Benedict Equation.

### **Module C: Nutri-Log & Analytics**
* **Consumption Tracker:** Logging scanned items against daily calorie and macro goals.
* **Data Visualization:** API endpoints structured for Chart.js to show weekly health trends.
* **Pantry Audit:** A historical overview of the "Health Grade" of items in the user's kitchen.

### **Module D: Smart Cart & AI Suggestions**
* **Healthy Swaps:** Logic to suggest "Green" rated alternatives for "Red" rated scans.
* **Inventory Management:** Shared grocery lists with expiry notifications.
* **AI Insight Feature:** LLM-powered analysis of weekly eating habits with actionable advice.

---

## 4. Database Schema (PostgreSQL)

| Table | Purpose | Key Fields |
| :--- | :--- | :--- |
| **Users** | Profile Management | id, email, password_hash, health_goal, bmr |
| **Products** | Local Cache of Scans | barcode, name, ingredients, nutri_score, processed_level |
| **Daily_Logs** | Calorie Tracking | id, user_id, barcode, serving_size, timestamp |
| **Shopping_List**| Grocery Utility | id, user_id, item_name, is_healthy_swap, status |

---

## 5. Development Roadmap (12-Week Plan)

### **Phase 1: Foundation (Weeks 1-2)**
* Database modeling and PostgreSQL setup.
* FastAPI boilerplate and Open Food Facts API integration.

### **Phase 2: Logic & Auth (Weeks 3-5)**
* Implementation of the Ingredient Parsing Algorithm.
* User Registration and JWT Authentication.

### **Phase 3: Utility Modules (Weeks 6-9)**
* Calorie tracking and Macro-Ring visualization logic.
* Grocery list and Pantry Management features.

### **Phase 4: AI & Deployment (Weeks 10-12)**
* Integration of AI Suggestion Engine.
* Final UI/UX polishing and project report documentation.

---

## 6. Risk & Mitigation
* **Incomplete API Data:** Implement an OCR fallback for manual ingredient parsing.
* **System Latency:** Use PostgreSQL indexing on `barcode` and `user_id` for $O(1)$ or $O(\log n)$ lookup speeds.