from fastapi import FastAPI
from app.routes import applications, auth, admin
from app.routes import job


app = FastAPI()

app.include_router(auth.router)
app.include_router(job.router)
app.include_router(applications.router)
app.include_router(admin.router)
