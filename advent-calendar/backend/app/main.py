from fastapi import FastAPI
from api.advent import router as advent_router
import models.user, models.door
from database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Advent Calendar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для разработки
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(advent_router)

@app.get("/")
def read_root():
    return {"message": "🎄 Welcome to Advent Calendar API!"}