from pydantic import BaseModel

class SavedJobBase(BaseModel):
    job_id: int

class SavedJobCreate(SavedJobBase):
    pass

class SavedJobResponse(SavedJobBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True  # (orm_mode=True for Pydantic v1)