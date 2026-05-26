from fastapi import FastAPI
from app.core.database import Base, engine
from app.models.user import User


app = FastAPI(
    title="TaskForge API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "TaskForge API Running"}