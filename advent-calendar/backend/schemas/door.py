from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DoorBase(BaseModel):
    day: int
    content_type: str
    content: str
    points: int = 10

class DoorCreate(DoorBase):
    pass

class Door(DoorBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserDoorBase(BaseModel):
    user_id: int
    door_id: int

class UserDoor(UserDoorBase):
    id: int
    opened_at: datetime

    class Config:
        from_attributes = True