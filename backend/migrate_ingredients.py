"""
Migration: Create ingredient_prices table and seed with realistic INR prices.
"""
import logging
from sqlalchemy import create_engine, text
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SEED_PRICES = [
    # Grains & Staples
    ("Oats", 45.0, "100g"),
    ("Rice", 60.0, "kg"),
    ("Brown Rice", 90.0, "kg"),
    ("Quinoa", 350.0, "kg"),
    ("Whole Wheat Bread", 45.0, "pack"),
    ("Multigrain Bread", 55.0, "pack"),
    ("Roti/Chapati", 5.0, "piece"),
    ("Pasta", 80.0, "500g"),
    ("Poha", 50.0, "500g"),
    ("Upma Rava", 55.0, "500g"),
    
    # Proteins
    ("Chicken Breast", 280.0, "kg"),
    ("Eggs", 7.0, "piece"),
    ("Paneer", 320.0, "kg"),
    ("Tofu", 120.0, "200g"),
    ("Dal (Lentils)", 140.0, "kg"),
    ("Chickpeas", 120.0, "kg"),
    ("Greek Yogurt", 80.0, "200g"),
    ("Whey Protein", 60.0, "scoop"),
    ("Fish (Rohu)", 300.0, "kg"),
    ("Salmon", 1200.0, "kg"),
    ("Prawns", 500.0, "kg"),
    ("Soy Chunks", 90.0, "200g"),
    ("Moong Dal", 160.0, "kg"),
    ("Rajma", 130.0, "kg"),
    ("Curd/Yogurt", 50.0, "500g"),
    ("Cottage Cheese", 120.0, "200g"),
    
    # Vegetables
    ("Spinach", 30.0, "bunch"),
    ("Broccoli", 60.0, "250g"),
    ("Bell Pepper", 40.0, "piece"),
    ("Tomato", 40.0, "kg"),
    ("Onion", 35.0, "kg"),
    ("Carrot", 40.0, "kg"),
    ("Cucumber", 25.0, "kg"),
    ("Sweet Potato", 50.0, "kg"),
    ("Potato", 30.0, "kg"),
    ("Cauliflower", 30.0, "piece"),
    ("Cabbage", 25.0, "piece"),
    ("Green Beans", 60.0, "kg"),
    ("Mushroom", 40.0, "200g"),
    ("Zucchini", 50.0, "piece"),
    ("Beetroot", 40.0, "kg"),
    ("Peas", 80.0, "kg"),
    ("Lettuce", 40.0, "bunch"),
    ("Kale", 60.0, "bunch"),
    
    # Fruits
    ("Banana", 5.0, "piece"),
    ("Apple", 15.0, "piece"),
    ("Orange", 10.0, "piece"),
    ("Mango", 40.0, "piece"),
    ("Berries (Mixed)", 200.0, "200g"),
    ("Papaya", 40.0, "piece"),
    ("Watermelon", 30.0, "kg"),
    ("Pomegranate", 60.0, "piece"),
    ("Grapes", 80.0, "500g"),
    ("Guava", 60.0, "kg"),
    
    # Healthy Fats
    ("Olive Oil", 450.0, "500ml"),
    ("Coconut Oil", 200.0, "500ml"),
    ("Ghee", 550.0, "500ml"),
    ("Almonds", 800.0, "kg"),
    ("Walnuts", 1200.0, "kg"),
    ("Peanuts", 150.0, "kg"),
    ("Peanut Butter", 250.0, "400g"),
    ("Almond Butter", 600.0, "400g"),
    ("Flaxseeds", 150.0, "200g"),
    ("Chia Seeds", 300.0, "200g"),
    ("Avocado", 120.0, "piece"),
    ("Sesame Seeds", 100.0, "200g"),
    ("Coconut (Desiccated)", 80.0, "200g"),
    ("Sunflower Seeds", 180.0, "200g"),
    
    # Dairy
    ("Milk", 28.0, "500ml"),
    ("Almond Milk", 200.0, "1L"),
    ("Cheese (Cheddar)", 120.0, "200g"),
    ("Butter", 55.0, "100g"),
    ("Cream", 60.0, "200ml"),
    
    # Spices & Condiments
    ("Turmeric", 30.0, "100g"),
    ("Cumin", 40.0, "100g"),
    ("Black Pepper", 80.0, "100g"),
    ("Ginger", 100.0, "kg"),
    ("Garlic", 150.0, "kg"),
    ("Green Chili", 60.0, "kg"),
    ("Honey", 250.0, "500g"),
    ("Maple Syrup", 500.0, "250ml"),
    ("Soy Sauce", 80.0, "200ml"),
    
    # Beverages
    ("Green Tea", 200.0, "100g"),
    ("Coffee Beans", 400.0, "250g"),
    ("Coconut Water", 30.0, "200ml"),
    ("Protein Shake Mix", 2500.0, "kg"),
]

def run_migration():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        # 1. Create table if not exists
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS ingredient_prices (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR UNIQUE NOT NULL,
                    price FLOAT NOT NULL,
                    unit VARCHAR DEFAULT 'unit',
                    last_updated TIMESTAMP DEFAULT NOW()
                )
            """))
            conn.commit()
            logger.info("ingredient_prices table ensured.")
        except Exception as e:
            logger.error(f"Table creation error: {e}")
            return

        # 2. Seed data (upsert)
        for name, price, unit in SEED_PRICES:
            try:
                conn.execute(text("""
                    INSERT INTO ingredient_prices (name, price, unit, last_updated)
                    VALUES (:name, :price, :unit, NOW())
                    ON CONFLICT (name) DO UPDATE SET price = :price, unit = :unit, last_updated = NOW()
                """), {"name": name, "price": price, "unit": unit})
            except Exception as e:
                logger.warning(f"Skipping {name}: {e}")
        
        conn.commit()
        logger.info(f"Seeded {len(SEED_PRICES)} ingredient prices.")

if __name__ == "__main__":
    run_migration()
