from pydantic import BaseModel

class BoardCreate(BaseModel):

    title: str

    description: str | None = None

class BoardResponse(BaseModel):

    id: int

    title: str

    description: str | None

    owner_id: int

    class Config:

        from_attributes = True