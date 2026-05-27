from fastapi import (
    APIRouter,
    HTTPException,
    Depends
)

from fastapi.security import HTTPBearer

from sqlalchemy.orm import Session

from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    TokenResponse
)

from app.models.user import User

from app.core.database import SessionLocal

from app.auth.hash import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token,
    verify_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()

@router.post("/register")
def register_user(
    user: UserRegister
):

    db: Session = SessionLocal()

    existing_user = db.query(
        User
    ).filter(
        User.email == user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message":
        "User registered successfully"
    }

@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    user: UserLogin
):

    db: Session = SessionLocal()

    existing_user = db.query(
        User
    ).filter(
        User.email == user.email
    ).first()

    if not existing_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    is_valid = verify_password(
        user.password,
        existing_user.password
    )

    if not is_valid:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token({

        "sub": existing_user.email,

        "role": existing_user.role
    })

    return {

        "access_token": access_token,

        "token_type": "bearer"
    }

@router.get("/me")
def get_current_user(
    credentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(
        token
    )

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    return {

        "email": payload.get("sub"),

        "role": payload.get("role")
    }