import logging
from sqlalchemy import create_engine, text
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migration():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        try:
            # Check if column exists
            result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='meal_templates' AND column_name='estimated_cost'"))
            if result.fetchone() is None:
                logger.info("Adding estimated_cost column to meal_templates...")
                conn.execute(text("ALTER TABLE meal_templates ADD COLUMN estimated_cost FLOAT DEFAULT 0.0"))
                conn.commit()
                logger.info("Migration successful.")
            else:
                logger.info("Column estimated_cost already exists.")
        except Exception as e:
            logger.error(f"Migration error: {e}")

if __name__ == "__main__":
    run_migration()
