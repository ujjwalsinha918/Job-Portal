from fastapi import FastAPI, Request  # ✅ Import Request here
from app.routes import applications, auth, admin
from app.routes import job
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from starlette.middleware.sessions import SessionMiddleware
import logging
import secrets
import os  # ✅ Add os import
from app.routes import profiles  # make sure this is the correct import path


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Portal API", version="1.0.0")

# ✅ Use environment variable with fallback
SESSION_SECRET_KEY = os.getenv("SESSION_SECRET_KEY", secrets.token_urlsafe(32))

app.add_middleware(
    SessionMiddleware,
    secret_key=SESSION_SECRET_KEY,
    max_age=3600 * 2,  # 2 hours for OAuth flow
    same_site="lax",
    https_only=False  # Set to True in production with HTTPS
)

# Add CORS middleware AFTER session middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,  # Required for cookies and sessions
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers AFTER middleware setup
app.include_router(auth.router, tags=["auth"])
app.include_router(job.router, tags=["job"])
app.include_router(applications.router, tags=["applications"])
app.include_router(admin.router, tags=["admin"])
app.include_router(profiles.router, tags=["profiles"])  # ✅ Fixed

@app.get("/")
def root():
    return {"message": "Backend running with FastAPI 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/test/session")
def test_session(request: Request):  # ✅ Correct type annotation
    """Test endpoint to verify session is working"""
    # Store a test value in session
    request.session["test"] = "session_working"
    
    return {
        "session_id": request.session.get("_session_id", "no_session_id"),
        "test_value": request.session.get("test"),
        "session_keys": list(request.session.keys()),
        "session_data": dict(request.session)  # ✅ Better debugging
    }