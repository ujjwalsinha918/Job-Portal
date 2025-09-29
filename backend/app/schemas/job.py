from pydantic import BaseModel
from app.models.job import JobStatus

class JobBase(BaseModel):
    title: str
    description: str
    location: str

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int # Job
    employer_id: int # and it's creator
    status: JobStatus

    class Config:
        orm_mode = True
