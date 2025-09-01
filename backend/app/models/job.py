from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Job(Base):
    # database table that the Job class will be mapped to
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    employer_id = Column(Integer, ForeignKey("users.id"))
    
    # job.employer
    employer = relationship("User", back_populates="jobs")
    # job.applications
    applications = relationship("Application", back_populates="job")