from sqlalchemy import relationship

# This line establishes a one-to-many relationship.
# It means a single User (an employer) can have multiple Job posts.
#`jobs` is a new attribute on the User object. When accessed, it will return a list
# of all `Job` objects associated with this user.
jobs = relationship("Job", back_populates="user")

# It means a single User (a job seeker) can submit multiple `Application`s.
# `applications` is a new attribute on the User object that will return a list
# of all `Application` objects submitted by this user.
applications = relationship("Application", back_populates="jobSeeker")
