from sqlalchemy.orm import Session
from app.utils.hash import verify_password
from app.schemas.user import UserCreate
from app.models.user import User 
from app.utils.hash import hash_password

def get_user_by_email(db: Session, email: str):
    """
    Return a User ORM object or None for given email.
    """
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate, role: str = "jobseeker"):
    """
    Create a new user.
    - user_in.password should be plain text; we hash it here.
    - returns the created User ORM object.
    """
    hashed_password = hash_password(user_in.password)
    # default empty string if not provided
    db_user = User(email=user_in.email, name=user_in.name, hashed_password=hashed_password, role=role, skills=getattr(user_in, "skills", ""))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
