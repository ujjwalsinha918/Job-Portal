from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# MySQL connection string
DATABASE_URL = "mysql+pymysql://root@localhost:3306/fastapi_db"

# Create engine and echo is parameter for debug (logs all sql statements)
engine = create_engine(DATABASE_URL, echo=True)

# Session--class to create new sessions objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models--- Python class that maps to a database table
Base = declarative_base()

# Dependency (used in routes)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
