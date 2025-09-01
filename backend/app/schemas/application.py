from pydantic import BaseModel
from enum import Enum

class ApplicationBase(BaseModel):
    job_id: int

class ApplicationOut(BaseModel):
    id: int # unique ID that the database generates automatically when a new application is created
    job_id: int  #  foreign key linking the application to the job
    jobseeker_id: int  # Jobseeker
    status: str  # Application status

    class Config:
        orm_mode = True
