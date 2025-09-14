from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import SessionLocal
from models.user import User
from models.door import Door, UserDoor
from schemas.user import UserCreate, User as UserSchema
from schemas.door import Door as DoorSchema, UserDoor as UserDoorSchema
import crud

router = APIRouter(prefix="/api")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def read_root():
    return {"message": "🎄 Advent Calendar API is running!"}

# Пользовательские эндпоинты
@router.post("/users/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_telegram_id(db, telegram_id=user.telegram_id)
    if db_user:
        return db_user
    return crud.create_user(db=db, user=user)

@router.get("/users/{telegram_id}", response_model=UserSchema)
def read_user(telegram_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_telegram_id(db, telegram_id=telegram_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Дверные эндпоинты
@router.get("/doors/", response_model=List[DoorSchema])
def read_doors(db: Session = Depends(get_db)):
    doors = crud.get_all_doors(db)
    return doors

@router.post("/users/{telegram_id}/open/{day}")
def open_door(telegram_id: str, day: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_telegram_id(db, telegram_id=telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    door = crud.get_door_by_day(db, day=day)
    if not door:
        raise HTTPException(status_code=404, detail="Door not found")
    
    result = crud.open_door(db, user.id, door.id)
    if result is None:
        raise HTTPException(status_code=400, detail="Door already opened")
    
    return {"status": "opened", "points_added": door.points}

@router.get("/doors/{day}")
def get_door_content(day: int, telegram_id: str, db: Session = Depends(get_db)):
    user = crud.get_user_by_telegram_id(db, telegram_id=telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    door = crud.get_door_by_day(db, day=day)
    if not door:
        raise HTTPException(status_code=404, detail="Door not found")
    
    user_door = db.query(UserDoor).filter(
        UserDoor.user_id == user.id,
        UserDoor.door_id == door.id
    ).first()
    
    if not user_door:
        raise HTTPException(status_code=403, detail="Door not opened yet")
    
    return {
        "day": door.day,
        "content_type": door.content_type,
        "content": door.content,
        "points": door.points
    }