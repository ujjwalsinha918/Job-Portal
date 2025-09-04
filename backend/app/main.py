from fastapi import FastAPI
from app.routes import applications, auth, admin
from app.routes import job
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.include_router(auth.router)
app.include_router(job.router)
app.include_router(applications.router)
app.include_router(admin.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)