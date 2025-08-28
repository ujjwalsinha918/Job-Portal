from pydantic import BaseModel, EmailStr

# Schema for registering a new user
class UserCreate(BaseModel):
    name: str                  # User's full name
    email: EmailStr            # Email must be valid format (e.g., test@example.com)
    password: str              # Raw password (will be hashed before storing)
    role: str                  # Role (e.g., "admin" or "job_seeker")

# Schema for user login
class UserLogin(BaseModel):
    email: EmailStr            # Login using email
    password: str              # Login using password    