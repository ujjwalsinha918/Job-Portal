from fastapi import FastAPI
from app.routes import jobs, applications, auth


app = FastAPI()

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
