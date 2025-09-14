from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    telegram_id: str
    username: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    points: int
    created_at: datetime

    class Config:
        from_attributes = True