from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import HTTPBearer

from sqlalchemy.orm import Session

from app.core.database import SessionLocal

from app.models.board import Board

from app.models.user import User

from app.schemas.board_schema import (
    BoardCreate,
    BoardResponse
)

from app.auth.jwt_handler import (
    verify_access_token
)

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)

security = HTTPBearer()

@router.post(
    "/",
    response_model=BoardResponse
)
def create_board(
    board: BoardCreate,
    credentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    new_board = Board(
        title=board.title,
        description=board.description,
        owner_id=user.id
    )

    db.add(new_board)

    db.commit()

    db.refresh(new_board)

    return new_board

@router.get(
    "/",
    response_model=list[BoardResponse]
)
def get_boards(
    credentials = Depends(security)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db: Session = SessionLocal()

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    boards = db.query(Board).filter(
        Board.owner_id == user.id
    ).all()

    return boards