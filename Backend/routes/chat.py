from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.report import Report
from schemas.report import ChatRequest
from services.llm import chat_about_report

router = APIRouter()

@router.post("/reports/{report_id}/chat")
def report_chat(report_id: int, request: ChatRequest, db: Session = Depends(get_db)):
    report = db.get(Report,report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found!")

    answer, report.chat_history = chat_about_report(report.summary_stats, report.chat_history,request.message)
    db.commit()
    return {"response": answer, "history": report.chat_history}
