from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import HTTPBearer

from sqlalchemy.orm import Session

from app.core.database import get_db

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
    credentials = Depends(security),
    db: Session = Depends(get_db)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

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
    credentials = Depends(security),
    db: Session = Depends(get_db)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    boards = db.query(Board).filter(
        Board.owner_id == user.id
    ).all()

    return boards

@router.put(
    "/{board_id}",
    response_model=BoardResponse
)
def update_board(
    board_id: int,
    board: BoardCreate,
    credentials = Depends(security),
    db: Session = Depends(get_db)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    existing_board = db.query(Board).filter(
        Board.id == board_id,
        Board.owner_id == user.id
    ).first()

    if not existing_board:

        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    existing_board.title = board.title

    existing_board.description = (
        board.description
    )

    db.commit()

    db.refresh(existing_board)

    return existing_board


@router.delete("/{board_id}")
def delete_board(
    board_id: int,
    credentials = Depends(security),
    db: Session = Depends(get_db)
):

    payload = verify_access_token(
        credentials.credentials
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = db.query(User).filter(
        User.email == payload.get("sub")
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    existing_board = db.query(Board).filter(
        Board.id == board_id,
        Board.owner_id == user.id
    ).first()

    if not existing_board:

        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    db.delete(existing_board)

    db.commit()

    return {
        "message":
        "Board deleted successfully"
    }
