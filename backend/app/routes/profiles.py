from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import ProfileUpdate
from app.utils.auth import get_current_user
from app.models.user import User


router = APIRouter(prefix="/profiles", tags=["Profiles"])

@router.get("/users/me")
def getprofile(user=Depends(get_current_user)):
    import logging
    logging.info(f"Fetching profile for user: {user}")
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "skills": getattr(user, "skills", None),
    }
    
@router.put("/users/me")
def updateprofile(profile: ProfileUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's profile information
    if profile.name is not None:
        db_user.name = profile.name
    if profile.skills is not None:
        db_user.skills = profile.skills

    db.commit()
    db.refresh(db_user)
    return {
        "message": "Profile updated successfully",
        "profile": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "skills": getattr(db_user, "skills", None),
        },
    }
