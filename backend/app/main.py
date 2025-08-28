from fastapi import FastAPI
from app.routers import auth_router


app = FastAPI()

@app.get("/")
def root():
    return {"message": "Backend running with FastAPI 🚀"}
