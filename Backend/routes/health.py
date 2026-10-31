from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from db.database import get_db

router = APIRouter()

@router.get("/health")
def get_health(session: Session = Depends(get_db)):
    health_status = {
        "status" : "online",
        "database":"disconnected",
        "middleware":"active"
    }

    try:
        session.execute(text("SELECT 1"))
        health_status["database"] = "Connected"
    except SQLAlchemyError:
        health_status["status"] = "error"
    return health_status