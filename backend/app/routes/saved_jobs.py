from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.saved_job import SavedJob
from app.models.job import Job
from app.models.user import User
from app.utils.auth import get_current_user


router = APIRouter(prefix="/saved-jobs", tags=["Saved Jobs"])

@router.post("/{job_id}")
def save_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Save a job to the user's saved jobs list."""
    existing = db.query(SavedJob).filter_by(user_id=current_user.id, job_id=job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")
    job = db.query(Job).get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    saved_job = SavedJob(user_id=current_user.id, job_id=job_id)
    db.add(saved_job)
    db.commit()
    return {"message": "Job saved successfully"}

@router.delete("/{job_id}")
def unsave_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SavedJob).filter_by(user_id=current_user.id, job_id=job_id).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Not saved yet")
    db.delete(saved)
    db.commit()
    return {"message": "Removed from saved jobs"}

@router.get("/")
def get_saved_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SavedJob).filter_by(user_id=current_user.id).all()
    return [s.job for s in saved]

