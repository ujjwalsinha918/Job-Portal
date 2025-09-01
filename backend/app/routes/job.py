from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.job import Job
from app.schemas.job import JobOut, JobCreate
from app.utils.auth import get_current_user

# Create a router for all /jobs/ endpoints
router = APIRouter(prefix="/jobs", tags=["Jobs"])
@router.get("/", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    """
    Public endpoint: Returns a list of all available jobs.
    - No authentication required.
    - Uses SQLAlchemy to fetch all jobs from DB.
    """
    jobs = db.query(Job).all()
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
