from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
from app.services import auth_service
from app.core.database import get_db

# Create a router object for authentication-related routes
router = APIRouter(prefix="/auth", tags=["Auth"])

# Register Route
@router.post("/register")
def register(user:UserCreate, db: Session = Depends(get_db)):
    """
    Handles new user registration.
    - Validates incoming request using UserCreate schema.
    - Calls the service layer to register a new user.
    - Returns a success message with the user's email.
    """
    new_user = auth_service.register_user(user, db)
    return {"message": "User registered successfully", "user": new_user.email}

#Login Route
@router.post("login")
def login(user:UserLogin, db:Session = Depends(get_db)):
    """
    Handles user login.
    - Validates incoming request using UserLogin schema.
    - Calls the service layer to check credentials.
    - If valid, returns JWT token + user role.
    - If invalid, raises HTTP 401 Unauthorized.
    """
    token, role = auth_service.login_user(db, user)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"access_token": token, "token_type": "bearer", "role": role}
