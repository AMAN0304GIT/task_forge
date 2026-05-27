from typing import Annotated

from pydantic import BaseModel, EmailStr, StringConstraints

Username = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=3,
        max_length=40
    )
]

Password = Annotated[
    str,
    StringConstraints(
        min_length=6,
        max_length=128
    )
]

class UserRegister(BaseModel):
    username: Username
    email: EmailStr
    password: Password

class UserLogin(BaseModel):
    email: EmailStr
    password: Password

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
