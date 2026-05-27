from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth.routes import (
    router as auth_router
)

from app.models.board import Board

from app.api.v1.boards.routes import (
    router as board_router
)

app = FastAPI(
    title="TaskForge API",
    version="1.0.0"
)

origins = [
    "http://localhost:4200",
    "http://127.0.0.1:4200"
]

app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(board_router)

@app.get("/")
def root():
    return {
        "message": "TaskForge API Running"
    }
