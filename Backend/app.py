from fastapi import FastAPI, Depends, UploadFile, File
import db
from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
import models
import pandas as pd
import google.generativeai as genai
import io
from fastapi import HTTPException
import os
from pydantic import BaseModel
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

models.Base.metadata.create_all(bind= db.engine)
app = FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins = ["http://localhost:3000"],
                   allow_methods = ["*"],
                   allow_headers = ["*"],)

def get_gemini_insights(stats_summary):
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""Start with a single short paragraph (max 40 words) that summarizes the top insight from the dataset. After that paragraph, provide brief, labeled sections (1-2 lines each) for: Outliers & Anomalies, Data Distribution, Key Statistics, Recommended Visualizations, and Data Quality Issues.

Statistics: {stats_summary}"""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "AI analysis currently unavailable, but your data was saved."

class ChatRequest(BaseModel):
    message: str

@app.get("/health")
def get_health(session: Session = Depends(db.get_db)):
    health_status = {
        "status" : "online",
        "database":"disconnected",
        "middleware":"active"
    }

    try:
        session.execute(text("SELECT 1"))
        health_status["database"] = "Connected"
    except Exception as e:
        health_status["status"] = "error"
    return health_status

@app.post("/upload")
async def upload(file: UploadFile = File(...), db: Session = Depends(db.get_db)):
    #Accessing the upload file
    contents = await file.read()
    #Reading the CSV file existence with exception handlers
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV File")

    #This can be used for preview
    raw_data = df.head(10).to_dict(orient="records")
    #Extracting the summary of csv file
    stats = df.describe(include="all").to_json()
    #Passing it to Gemini LLM
    ai_insights = get_gemini_insights(stats)
    
    #Creating an object of report
    new_report = models.Report(filename= file.filename,
                                raw_data=raw_data,
                                summary_stats=stats,
                                ai_insights = ai_insights,
                                chat_history = [])

    #Adding to database
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    #Return the Report
    return {"id": new_report.id,
        "filename": new_report.filename,
        "ai_insights": new_report.ai_insights,
        "raw_data": new_report.raw_data}

@app.get("/reports/recent")
def get_recent_reports(db: Session = Depends(db.get_db)):
    # Query all reports to get complete data
    results = db.query(models.Report).order_by(models.Report.created_at.desc()).limit(10).all()
    
    # Return complete report data for each
    return [{"id": r.id, "filename": r.filename, "ai_insights": r.ai_insights, "raw_data": r.raw_data, "summary_stats": r.summary_stats, "chat_history": r.chat_history, "created_at": r.created_at} for r in results]

@app.get("/reports/{report_id}")
def get_report_details(report_id: int, db: Session = Depends(db.get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Return complete report data
    return {"id": report.id, "filename": report.filename, "ai_insights": report.ai_insights, "raw_data": report.raw_data, "summary_stats": report.summary_stats, "chat_history": report.chat_history, "created_at": report.created_at}

@app.post("/reports/{report_id}/chat")
def report_chat(report_id: int, request: ChatRequest, db: Session = Depends(db.get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found!")
    
    model = genai.GenerativeModel("gemini-2.5-flash")
    chat = model.start_chat(history=report.chat_history)

    # Build a concise prompt instructing the assistant to reply briefly
    full_prompt = f"""You are a concise data analysis assistant.

Context (dataset statistics): {report.summary_stats}

User Question: {request.message}

Reply instructions: Start with a single, short paragraph (one sentence, max 25 words) that directly answers the user. If the user requests details, provide at most 2 short bullet points (each ≤ 15 words). Always be brief and actionable.
"""

    response = chat.send_message(full_prompt)
    
    # Update history in DB
    report.chat_history = [
        {"role": m.role, "parts": [p.text for p in m.parts]} 
        for m in chat.history
    ]

    db.commit()
    return {"response": response.text, "history": report.chat_history}
