import os

from dotenv import load_dotenv

load_dotenv()

def _require(api_key:str) -> str:
    value = os.getenv(api_key)
    if not value:
        return "ValueError: No API Key"
    return value        

def _normalize_db_url(url: str) ->str:
    for prefix in ("postgres://","postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg2://"+url[len(prefix):]
    return url


GEMINI_API_KEY = _require("GEMINI_API_KEY")
DATABASE_URL = _normalize_db_url(_require("DATABASE_URL"))
MODEL_NAME = _require("MODEL_NAME")
FRONTEND_ORIGINS = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]