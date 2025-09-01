from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class ApplicationStatus(str, enum.Enum):
    pending = "pending"  # The application has been submitted and is awaiting review.
    accepted = "accepted"  # The application has been accepted by the employer.
    rejected = "rejected"  # The application has been rejected by the employer.

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    jobseeker_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.pending)

    # Define relationships with other SQLAlchemy models.
    #Establishes a many-to-one relationship with the `Job` model.
    # `back_populates` creates a bidirectional link, allowing a `Job` object to
    # access a list of its `applications`
    job = relationship("Job", back_populates="applications")
    jobSeeker = relationship("User", back_populates="applications")