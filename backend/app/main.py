from fastapi import FastAPI

from app.api.v1.auth.routes import router as auth_router

app = FastAPI(
    title="TaskForge API",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "TaskForge API Running"
    }