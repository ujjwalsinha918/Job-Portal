from fastapi import UploadFile, File, Depends, APIRouter, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
import os
import logging

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import ProfileUpdate
from app.utils.auth import get_current_user

# Setup logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/profiles", tags=["Profiles"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/debug/check-user/{user_id}")
def debug_check_user(user_id: int, db: Session = Depends(get_db)):
    """Debug endpoint to check what's in the database"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        return {"error": "User not found"}
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "resume_raw": user.resume,
        "resume_type": type(user.resume).__name__,
        "resume_bool": bool(user.resume),
        "resume_is_none": user.resume is None,
        "resume_length": len(user.resume) if user.resume else 0,
        "file_exists": os.path.exists(user.resume) if user.resume else False
    }


@router.get("/users/me")
def getprofile(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """
    ⭐ CRITICAL FIX: Always query fresh user from database
    """
    logger.info(f"🔍 Fetching profile for user ID: {user.id}")
    
    # Query fresh user from database
    fresh_user = db.query(User).filter(User.id == user.id).first()
    
    if not fresh_user:
        logger.error(f"❌ User not found in database")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert resume path to boolean for frontend
    # Handle edge case where 'None' string got stored instead of NULL
    resume_value = fresh_user.resume
    if resume_value in ('None', 'null', ''):
        resume_value = None
    
    has_resume = bool(resume_value)
    
    logger.info(f"📄 Resume path: '{fresh_user.resume}' (raw), Processed: '{resume_value}', Has resume: {has_resume}")
    
    profile_data = {
        "id": fresh_user.id,
        "name": fresh_user.name,
        "email": fresh_user.email,
        "skills": fresh_user.skills,
        "resume": has_resume  # ⭐ Return boolean, not the path
    }
    
    logger.info(f"✅ Returning profile: {profile_data}")
    return profile_data


@router.put("/users/me")
def updateprofile(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    logger.info(f"💾 Updating profile for user {user.id}")
    
    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        logger.error(f"❌ User not found")
        raise HTTPException(status_code=404, detail="User not found")

    if profile.name is not None:
        db_user.name = profile.name
        logger.info(f"✏️ Updated name to: {profile.name}")

    if profile.skills is not None:
        db_user.skills = profile.skills
        logger.info(f"✏️ Updated skills")

    db.commit()
    db.refresh(db_user)
    
    logger.info(f"✅ Profile updated successfully")

    return {
        "message": "Profile updated successfully",
        "profile": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "skills": db_user.skills,
            "resume": bool(db_user.resume)
        },
    }


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info(f"📤 Resume upload initiated by user {current_user.id}")
    logger.info(f"📄 File: {file.filename}, Type: {file.content_type}")
    
    # Validate type
    if not file.filename.endswith((".pdf", ".doc", ".docx")):
        logger.warning(f"⚠️ Invalid file type rejected")
        return JSONResponse(status_code=400, content={"detail": "Invalid file type."})

    # Save file
    file_path = os.path.join(UPLOAD_DIR, f"user_{current_user.id}_{file.filename}")
    logger.info(f"💾 Saving to: {file_path}")
    
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        logger.info(f"✅ File saved - Size: {len(content)} bytes")
    except Exception as e:
        logger.error(f"❌ File save failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")

    # ⭐ Query fresh user from database
    db_user = db.query(User).filter(User.id == current_user.id).first()
    if not db_user:
        logger.error(f"❌ User not found in database")
        raise HTTPException(status_code=404, detail="User not found")

    # Update DB
    logger.info(f"📝 Old resume: '{db_user.resume}'")
    db_user.resume = file_path
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        logger.info(f"✅ Database updated - New resume: '{db_user.resume}'")
        
        # Verify
        verify = db.query(User).filter(User.id == current_user.id).first()
        logger.info(f"🔍 Verification - Resume in DB: '{verify.resume}'")
        
    except Exception as e:
        logger.error(f"❌ Database commit failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    # 🆕 ADD THIS LOG
    response_data = {
        "detail": "Resume uploaded successfully!",
        "resume_path": file_path,
        "resume": True
    }
    logger.info(f"📤 Sending response to frontend: {response_data}")
    
    return response_data


@router.get("/my-resume")
def get_resume(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logger.info(f"📥 Download requested by user {current_user.id}")
    
    # ⭐ Query fresh user from database
    fresh_user = db.query(User).filter(User.id == current_user.id).first()
    if not fresh_user:
        logger.error(f"❌ User not found")
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"📄 Resume path: '{fresh_user.resume}'")
    
    if not fresh_user.resume:
        logger.warning(f"⚠️ No resume in database")
        raise HTTPException(status_code=404, detail="Resume not found in database.")
    
    if not os.path.exists(fresh_user.resume):
        logger.error(f"❌ File not found at: {fresh_user.resume}")
        raise HTTPException(status_code=404, detail="Resume file not found on server.")
    
    file_size = os.path.getsize(fresh_user.resume)
    logger.info(f"✅ Serving file - Size: {file_size} bytes")
    
    return FileResponse(
        fresh_user.resume, 
        filename=os.path.basename(fresh_user.resume),
        media_type='application/octet-stream'
    )