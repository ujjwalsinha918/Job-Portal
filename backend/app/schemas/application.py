from pydantic import BaseModel
from enum import Enum
from app.models.application import ApplicationStatus


class ApplicationBase(BaseModel):
    job_id: int
    

# ---------- Create Schema ----------
# class ApplicationCreate(ApplicationBase):
#     """When a jobseeker applies for a job."""
#     pass


# ---------- Update Schema ----------
class ApplicationStatusUpdate(BaseModel):
    """When an employer updates the status of an application."""
    status: ApplicationStatus
    
    
class ApplicationOut(BaseModel):
    id: int # unique ID that the database generates automatically when a new application is created
    job_id: int  #  foreign key linking the application to the job
    jobseeker_id: int  # Jobseeker
    status: str  # Application status
    

    class Config:
        from_attributes = True
