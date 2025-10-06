from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    UniqueConstraint,   # ✅ Add this line
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job")
    
    __table_args__ = (UniqueConstraint('user_id', "job_id", name='unique_user_job'),)