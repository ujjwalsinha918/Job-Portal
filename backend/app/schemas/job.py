from pydantic import BaseModel

class JobBase(BaseModel):
    title: str
    description: str
    location: str

class JobCreate(JobBase):
    pass

class JobOut(JobBase):
    id: int # Job
    employer_id: int # and it's creator

    class Config:
        orm_mode = True
