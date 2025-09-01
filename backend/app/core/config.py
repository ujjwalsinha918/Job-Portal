from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OAuth / Frontend
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URL: str
    FRONTEND_URL: str

    # JWT + DB
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL: str

    class Config:
        env_file = ".env"  # load values from .env

settings = Settings()        