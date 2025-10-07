from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"  # sql model for user's table

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    role = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    skills = Column(String(255), nullable=True)
    resume = Column(String(255), nullable=True)

    # This line establishes a one-to-many relationship.
    # It means a single User (an employer) can have multiple Job posts.
    #`jobs` is a new attribute on the User object. When accessed, it will return a list
    # of all `Job` objects associated with this user.
    jobs = relationship("Job", back_populates="employer")

    # It means a single User (a job seeker) can submit multiple `Application`s.
    # `applications` is a new attribute on the User object that will return a list
    # of all `Application` objects submitted by this user.
    applications = relationship("Application", back_populates="jobSeeker")
    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete")

