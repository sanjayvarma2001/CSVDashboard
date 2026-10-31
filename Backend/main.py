from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import FRONTEND_ORIGINS
from db.database import Base, engine
from routes import chat, health, reports

app = FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins=[FRONTEND_ORIGINS],
                   allow_credentials=True,
                   allow_methods = ["*"],
                   allow_headers = ["*"],)

Base.metadata.create_all(bind=engine)

app.include_router(health.router)
app.include_router(reports.router)
app.include_router(chat.router)