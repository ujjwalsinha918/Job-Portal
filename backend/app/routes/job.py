from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import Job
from app.schemas.job import JobOut, JobCreate
from app.utils.auth import get_current_user
import logging
logger = logging.getLogger(__name__)

# Create a router for all /jobs/ endpoints
router = APIRouter(prefix="/jobs", tags=["Jobs"])
@router.get("/", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    """
    Public endpoint: Returns a list of all available jobs.
    - No authentication required.
    - Uses SQLAlchemy to fetch all jobs from DB.
    """
    jobs = db.query(Job).filter(Job.status == "approved").all()
    return jobs

# Employer → create job
@router.post("/", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(job: JobCreate, db: Session = Depends(get_db), User = Depends(get_current_user)): # Extract logged-in user from JWT
    # Check role (only employers can post jobs)
    if User.role != "employer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="only employers can post jobs")
    
    # Create new Job instance
    new_job = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        employer_id=User.id # link job to the employer who created it
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.put("/{job_id}", response_model=JobOut)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    logger.debug(f"Update request for job_id={job_id} by user={user.id}")
    db_job = db.query(Job).filter(Job.id == job_id, Job.employer_id == user.id).first()
    if not db_job:
        logger.error(f"Job {job_id} not found or not owned by user {user.id}")
        raise HTTPException(status_code=404, detail="Job not found")

    db_job.title = job.title
    db_job.description = job.description    
    db_job.location = job.location
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user),):
    db_job = db.query(Job).filter(Job.id == job_id, Job.employer_id == user.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found or not authorized")

    db.delete(db_job)
    db.commit()
    return None  # 204 → no content