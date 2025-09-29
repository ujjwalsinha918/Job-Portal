from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.schemas.user import UserResponse
from app.utils.auth import get_current_user
from app.models.job import JobStatus
from app.schemas.job import JobOut


router = APIRouter(prefix="/admin", tags=["Admin"])


# GET /admin/users
# Admin can see all users
@router.get("/users", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Only admins allowed
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all users"
        )

    return db.query(User).all()


# DELETE /admin/users/{id}
# Admin can delete a user + cascade delete jobs & applications
@router.delete("/users/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Only admins allowed
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete users"
        )

    # Find user by ID
    target_user = db.query(User).filter(User.id == id).first()
    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Cascade delete: If employer → delete their jobs & applications
    if target_user.role == "employer":
        jobs = db.query(Job).filter(Job.employer_id == id).all()
        for job in jobs:
            db.query(Application).filter(Application.job_id == job.id).delete()
        db.query(Job).filter(Job.employer_id == id).delete()

    # Cascade delete: If jobseeker → delete their applications
    if target_user.role == "jobseeker":
        db.query(Application).filter(Application.jobseeker_id == id).delete()

    # Finally delete the user
    db.delete(target_user)
    db.commit()
    return {"detail": "User deleted successfully"}

@router.put("/jobs/{job_id}/approve", response_model=JobOut)
def approve_job(job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can approve jobs")
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = JobStatus.approved
    db.commit()
    db.refresh(job)
    return job

@router.put("/jobs/{job_id}/reject", response_model=JobOut)
def reject_job(job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can reject jobs")
    
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job.status = JobStatus.rejected
    db.commit()
    db.refresh(job)
    return job

@router.get("/jobs/pending", response_model=list[JobOut])
def list_pending_jobs(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view pending jobs"
        )
    
    jobs = db.query(Job).filter(Job.status == JobStatus.pending).all()
    return jobs
