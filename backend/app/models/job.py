from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class JobStatus(str, enum.Enum):
    pending = "pending"      # default when created by employer
    approved = "approved"    # admin approved → visible to jobseekers
    rejected = "rejected"    # admin rejected → hidden from jobseekers
    
class Job(Base):
    # database table that the Job class will be mapped to
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(100), nullable=False)
    employer_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(JobStatus), default=JobStatus.pending)
    
    # job.employer
    employer = relationship("User", back_populates="jobs")
    # job.applications
    applications = relationship("Application", back_populates="job")