from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings # load db url from env

# MySQL connection string
DATABASE_URL = f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# Create engine and echo is parameter for debug (logs all sql statements)
engine = create_engine(DATABASE_URL, pool_pre_ping=True, echo=True) # checks connection before using

# Session--class to create new sessions objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models--- Python class that maps to a database table--- all models inherit from this
Base = declarative_base()

# try:
#     with engine.connect() as conn:
#         result = conn.execute(text("SELECT 1"))
#         print("✅ Database connected:", result.scalar())
# except Exception as e:
#     print("❌ Database connection failed:", e)

# Dependency (used in routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
