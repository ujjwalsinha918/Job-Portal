from fastapi import FastAPI
from app.routes import applications, auth, admin
from app.routes import job
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)
app.include_router(job.router)
app.include_router(applications.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Backend running with FastAPI 🚀"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)