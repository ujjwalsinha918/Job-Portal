from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.utils.hash import hash_password, verify_password
from jose import jwt
from datetime import datetime, timedelta


SECRET_KEY = "supersecretkey"  # change to env variable in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

#Register Service
def register_user(db: Session, user: UserCreate):
    """
    Registers a new user in the system.
    1. Hash the plain-text password before saving.
    2. Create a User model object.
    3. Add and commit the user to the database.
    4. Refresh to get updated data (e.g., generated ID).
    5. Return the saved user object.
    """
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    hashed_pw = hash_password(user.password)
    new_user = User(name=user.name, email=user.email, password=hashed_pw, role=user.role)

    db.add(new_user)   # Add to database session
    db.commit()       # Save changes
    db.refresh(new_user)  # Reload object with DB-generated values
    return new_user

# Login Service
def login_user(db: Session, user: UserLogin):
    """
    Logs in a user by verifying credentials.
    Steps:
    1. Query user by email.
    2. If user not found → return None.
    3. Verify provided password with stored hashed password.
    4. If invalid → return None.
    5. If valid → generate a JWT access token with email & role.
    6. Return token and user role.
    """
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        return None, None
    
    # Create JWT token (payload includes email & role)
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode({"sub": db_user.email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
    token = create_access_token({"sub":db_user.email, "role": db_user.role})
    return token, db_user.role
