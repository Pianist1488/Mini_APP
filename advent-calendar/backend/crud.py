from sqlalchemy.orm import Session
from models.user import User
from models.door import Door, UserDoor
from schemas.user import UserCreate
from datetime import datetime

# Пользователи
def get_user_by_telegram_id(db: Session, telegram_id: str):
    return db.query(User).filter(User.telegram_id == telegram_id).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        telegram_id=user.telegram_id,
        username=user.username
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def add_points(db: Session, user_id: int, points: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.points += points
        db.commit()
        db.refresh(user)
    return user

# Двери
def get_door_by_day(db: Session, day: int):
    return db.query(Door).filter(Door.day == day).first()

def get_all_doors(db: Session):
    return db.query(Door).all()

# Открытие дверей
def open_door(db: Session, user_id: int, door_id: int):
    existing = db.query(UserDoor).filter(
        UserDoor.user_id == user_id,
        UserDoor.door_id == door_id
    ).first()
    if existing:
        return None

    user_door = UserDoor(user_id=user_id, door_id=door_id)
    db.add(user_door)
    
    door = db.query(Door).filter(Door.id == door_id).first()
    if door:
        add_points(db, user_id, door.points)

    db.commit()
    db.refresh(user_door)
    return user_door

def get_user_opened_doors(db: Session, user_id: int):
    return db.query(UserDoor).filter(UserDoor.user_id == user_id).all()