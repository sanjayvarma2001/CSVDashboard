from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from db import Base
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    raw_data = Column(JSONB)
    summary_stats = Column(JSONB)
    ai_insights = Column(Text)
    chat_history = Column(JSONB, default=[])
    created_at = Column(DateTime, default= datetime.now)