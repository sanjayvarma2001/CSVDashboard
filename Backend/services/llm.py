from google import genai
from google.genai import errors

from core.config import GEMINI_API_KEY, MODEL_NAME

client = genai.Client(api_key=GEMINI_API_KEY)

def get_gemini_insights(stats_summary):

    prompt = f"""Start with a single short paragraph (max 40 words) that summarizes the top insight from the dataset. After that paragraph, provide brief, labeled sections (1-2 lines each) for: Outliers & Anomalies, Data Distribution, Key Statistics, Recommended Visualizations, and Data Quality Issues.

Statistics: {stats_summary}"""
    try:
        response = client.models.generate_content(model=MODEL_NAME,contents=prompt)
        return response.text
    except errors.APIError as e:
        print(f"Gemini Error: {e}")
        return "AI analysis currently unavailable, but your data was saved."

def _to_content(entry: dict)->dict:
    parts = [p if isinstance(p,dict) else {"text":p} for p in entry["parts"]]
    return {"role":entry["role"], "parts": parts}

def chat_about_report(summary_stats: str,history: list,message: str) -> tuple(str,list):
    chat = client.chats.create(model=MODEL_NAME, history= [_to_content(e) for e in (history or [])],)
    prompt = f"""You are a concise data analysis assistant.

Context (dataset statistics): {summary_stats}

User Question: {message}

Reply instructions: Start with a single, short paragraph (one sentence, max 25 words) that directly answers the user. If the user requests details, provide at most 2 short bullet points (each ≤ 15 words). Always be brief and actionable.
"""
    response = chat.send_message(prompt)
    new_history = [
        {"role": c.role, "parts": [{"text": p.text} for p in c.parts if p.text] }
        for c in chat.get_history()
    ]
    return response.text, new_history