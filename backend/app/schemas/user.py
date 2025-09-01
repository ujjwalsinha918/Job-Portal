from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str # "jobseeker" or "employer"

# Schema for registering a new user
class UserCreate(UserBase):
    password: str # Raw password (will be hashed before storing)

# Schema for user login
class UserResponse(UserBase):
    id: int # new User

    class Config:
        orm_mode = True # allows SQLAlchemy objects → Pydantic