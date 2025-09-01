from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.models.user import User 
from app.core import security

def get_user_by_email(db: Session, email: str):
    """
    Return a User ORM object or None for given email.
    """
    return db.query(User).fi
def create_user(db: Session, user_in: UserCreate, role: str = "jobseeker"):
    """
    Create a new user.
    - user_in.password should be plain text; we hash it here.
    - returns the created User ORM object.
    """
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(email=user_in.email, name=user_in.name, password=hashed_password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
