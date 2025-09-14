from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Door(Base):
    __tablename__ = "doors"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(Integer, unique=True)  # 1-24
    content_type = Column(String)  # "text", "image", "video", "link"
    content = Column(String)  # URL или текст
    points = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)

class UserDoor(Base):
    __tablename__ = "user_doors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    door_id = Column(Integer, ForeignKey("doors.id"))
    opened_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="opened_doors")