# Import required modules
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Import database session dependency
from app.core.database import get_db

# Import models & schemas
from app.models.application import Application
from app.models.job import Job
from app.schemas.application import ApplicationBase, ApplicationOut

# Import authentication utility (to get logged-in user)
from app.utils.auth import get_current_user

# Create router with prefix `/applications`
router = APIRouter(prefix="/applications", tags=["Applications"])


# ---------------------------
# POST /applications/
# Jobseeker applies for a job
# ---------------------------
@router.post("/", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_for_job(
    data: ApplicationBase,               # Job ID comes from request body
    db: Session = Depends(get_db),       # Inject DB session
    user=Depends(get_current_user)       # Get current logged-in user
):
    # 1. Check if user is a jobseeker
    if user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only jobseekers can apply for jobs"
        )

    # 2. Check if job exists
    job = db.query(Job).filter(Job.id == data.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # 3. Check if already applied
    existing = db.query(Application).filter(
        Application.job_id == data.job_id,
        Application.jobseeker_id == user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )

    # 4. Create new application
    new_app = Application(job_id=data.job_id, jobseeker_id=user.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return new_app


# ---------------------------
# GET /applications/me
# Jobseeker views their applications
# ---------------------------
@router.get("/me", response_model=list[ApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # 1. Ensure only jobseekers can access this
    if user.role != "jobseeker":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only jobseekers can view their applications"
        )

    # 2. Fetch all applications for the logged-in user
    apps = db.query(Application).filter(
        Application.jobseeker_id == user.id
    ).all()

    return apps
