from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.application import Application
from app.schemas.application import ApplicationOut, ApplicationBase
from app.utils.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])
@router.post("/",response_model=ApplicationOut)
def apply_for_job(
    data: ApplicationBase,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)  
):
    if user.role != "jobseeker":
        raise HTTPException(status_code=403, detail="Only job seekers can apply for jobs.")
    
    new_app = Application(job_id=data.job_id, jobseeker_id=user.id)
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@router.get("/me", response_model=list[ApplicationOut])
def get_my_applications(db: Session = Depends(get_db), user=Depends(get_current_user)):

    if user.role != "jobseeker":
        raise HTTPException(status_code=403, detail="Only job seekers can view their applications.")
    
    return db.query(Application).filter(Application.jobseeker_id == user.id).all()