from pydantic import BaseModel

class Job_Base(BaseModel):
    title: str
    description: str
    location: str

class JobOut(JobBase):
    # The unique ID of the job, an integer.
    id: int
    # The ID of the employer (user) who created the job, an integer.
    employer_id: int

    class Config:
        orm_mode = True