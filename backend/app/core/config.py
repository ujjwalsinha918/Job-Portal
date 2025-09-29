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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day ✅

    DATABASE_URL: str
    SESSION_SECRET_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
    