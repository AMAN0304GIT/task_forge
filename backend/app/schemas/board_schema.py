from typing import Annotated

from pydantic import BaseModel, StringConstraints, field_validator

BoardTitle = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=80
    )
]

class BoardCreate(BaseModel):

    title: BoardTitle

    description: str | None = None

    @field_validator("description")
    @classmethod
    def clean_description(cls, value):

        if value is None:

            return None

        value = value.strip()

        if not value:

            return None

        if len(value) > 300:

            raise ValueError(
                "Description must be 300 characters or fewer"
            )

        return value

class BoardResponse(BaseModel):

    id: int

    title: str

    description: str | None

    owner_id: int

    class Config:

        from_attributes = True
