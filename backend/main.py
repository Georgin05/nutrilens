from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables
from app.api.routes import products, users, logs, analytics

# Database Initialization
def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(
    title="NutriLens API",
    description="Backend API for the NutriLens Application",
    version="1.0.0",
    lifespan=lifespan
)


# CORS Middleware for Frontend Communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with actual frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(users.router)
app.include_router(logs.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to NutriLens API"}
