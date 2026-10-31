import io

import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from db.database import get_db
from models.report import Report
from services import analysis

router = APIRouter()
@router.post("/upload")
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    #Accessing the upload file
    contents = await file.read()
    #Reading the CSV file existence with exception handlers
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except (pd.errors.ParserError, pd.errors.EmptyDataError, UnicodeDecodeError):
        raise HTTPException(status_code=400, detail="Invalid CSV File")
    new_report = analysis.analysis(df,file.filename)
        #Adding to database
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {
        "id": new_report.id,
        "filename": new_report.filename,
        "ai_insights": new_report.ai_insights,
        "raw_data": new_report.raw_data,
    }

@router.get("/reports/recent")
def get_recent_report(db: Session=Depends(get_db)):
    result = db.query(Report).order_by(Report.created_at.desc()).limit(10).all()
    return [{"id": r.id, "filename": r.filename, "ai_insights": r.ai_insights, "raw_data": r.raw_data, "summary_stats": r.summary_stats, "chat_history": r.chat_history, "created_at": r.created_at} for r in result]

@router.get("/reports/{report_id}")
def get_report_details(report_id: int, db: Session=Depends(get_db)) -> dict:
    report= db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code = 404, detail="Report not found")

    return {"id":report.id, "filename":report.filename,"ai_insights": report.ai_insights, "raw_data":report.raw_data, "summary_stats": report.summary_stats, "chat_history": report.chat_history, "created_at": report.created_at}