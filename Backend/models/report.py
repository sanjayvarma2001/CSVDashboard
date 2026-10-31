from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB

from db.database import Base


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    raw_data = Column(JSONB)
    summary_stats = Column(JSONB)
    ai_insights = Column(Text)
    chat_history = Column(JSONB, default=[])
    created_at = Column(DateTime, default= datetime.now)