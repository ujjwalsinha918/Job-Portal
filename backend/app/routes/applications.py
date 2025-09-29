# Import required modules
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Import database session dependency
from app.core.database import get_db

# Import models & schemas
from app.models.application import Application
from app.models.job import Job
from app.schemas.application import ApplicationBase, ApplicationOut, ApplicationStatusUpdate

# Import authentication utility (to get logged-in user)
from app.utils.auth import get_current_user
from app.models.application import ApplicationStatus

# Create router with prefix `/applications`
router = APIRouter(prefix="/applications", tags=["Applications"])



# ---------------------------
# POST /applications/
# Jobseeker applies for a job
# ---------------------------
@router.post("/apply/{job_id}")
def apply_for_job(job_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    print(f"User: {user}")
    existing = db.query(Application).filter_by(job_id=job_id, jobseeker_id=user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")

    app = Application(job_id=job_id, jobseeker_id=user.id)
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


# ---------------------------
# GET /applications/me
# Jobseeker views their applications
# ---------------------------
@router.get("/employer")
def get_applications_for_employer(user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Ensure only employers can access this endpoint
    if user.role != "employer":
        raise HTTPException(status_code=403, detail="Access denied. Employer role required.")
    
    # Get all jobs posted by this employer
    jobs = db.query(Job).filter(Job.employer_id == user.id).all()
    job_ids = [job.id for job in jobs]
    
    # Fixed: Changed 'jobid' to 'job_id'
    applications = db.query(Application).filter(Application.job_id.in_(job_ids)).all()
    
    return [
        {
            "id": app.id,
            "job": {
                "id": app.job.id,
                "title": app.job.title,
            },
            "jobseeker": {
                "id": app.jobSeeker.id,
                "email": app.jobSeeker.email,
                "name": app.jobSeeker.name,
            },
            "applied_at": app.applied_at,
            "status": app.status
        }
        for app in applications
    ]

# ---------------------------
# GET /applications/jobseeker
# Jobseeker views their applications
# ---------------------------
@router.get("/jobseeker")
def get_applications_for_jobseeker(user=Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Returns all applications submitted by the currently logged-in jobseeker.
    """
    # Ensure only jobseekers can access this endpoint
    if user.role != "jobseeker":
        raise HTTPException(status_code=403, detail="Access denied. Jobseeker role required.")
    
    applications = db.query(Application).filter(Application.jobseeker_id == user.id).all()
    
    return [
        {
            "id": app.id,
            "job": {
                "id": app.job.id,
                "title": app.job.title,
                "company": app.job.employer.name,
                "location": app.job.location,
            },
            "applied_at": app.applied_at,
            "status": app.status.value
        }
        for app in applications
    ]  
    
@router.put("/{application_id}/status")
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Only employer can update
    if user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")

    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Ensure employer owns the job
    if application.job.employer_id != user.id:
        raise HTTPException(status_code=403, detail="Not your job")

    application.status = payload.status
    db.commit() 
    db.refresh(application)
    return {"message": "Status updated", "status": application.status}     