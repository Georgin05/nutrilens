from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables
from app.api.routes import products, users, logs, analytics, inventory, dashboard, lenses, smart_cart, admin

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
app.include_router(inventory.router)
app.include_router(dashboard.router)
app.include_router(lenses.router, prefix="/lenses", tags=["Lenses"])
app.include_router(smart_cart.router, prefix="/smart-cart", tags=["Smart Cart"])
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to NutriLens API"}
