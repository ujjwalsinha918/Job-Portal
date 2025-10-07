from fastapi import UploadFile, File, Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import ProfileUpdate
from app.utils.auth import get_current_user
from app.models.user import User
from fastapi.responses import FileResponse



router = APIRouter(prefix="/profiles", tags=["Profiles"])
UPLOAD_DIR = "uploads/resumes"

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
    
    
@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Validate file type
    if not file.filename.endswith((".pdf", ".doc", ".docx")):
        return JSONResponse(status_code=400, content={"detail": "Invalid file type."})
    
    # Save file locally
    file_path = os.path.join(UPLOAD_DIR, f"user_{current_user.id}_{file.filename}")
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # Save path in DB
    current_user.resume = file_path
    db.commit()
    
    return {"detail": "Resume uploaded successfully!", "resume_path": file_path}

@router.get("/my-resume")
def get_resume(current_user: User = Depends(get_current_user)):
    if not current_user.resume or not os.path.exists(current_user.resume):
        return JSONResponse(status_code=404, content={"detail": "Resume not found."})
    return FileResponse(current_user.resume, filename="resume.pdf")