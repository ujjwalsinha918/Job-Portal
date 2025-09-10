from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.models.user import User 
from app.utils.hash import hash_password

def get_user_by_email(db: Session, email: str):
    """
    Return a User ORM object or None for given email.
    """
    return db.query(User).find_one_by(email=email)
def create_user(db: Session, user_in: UserCreate, role: str = "jobseeker"):
    """
    Create a new user.
    - user_in.password should be plain text; we hash it here.
    - returns the created User ORM object.
    """
    hashed_password = hash_password(user_in.password)
    db_user = User(email=user_in.email, name=user_in.name, password=hashed_password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
