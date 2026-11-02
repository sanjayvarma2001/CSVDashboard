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

def _clean_user_text(text:str)->str:
    if "User Question:" in text:
           text = text.split("User Question:", 1)[1]
           text = text.split("Reply instructions:", 1)[0]
    return text.strip()

def _to_content(entry: dict)->dict:
    raw_entry = entry.get("parts") or entry.get("part") or []
    parts = []
    for p in raw_entry:
        text = p.get("text","") if isinstance(p, dict) else p
        if entry["role"] == "user":
            text = _clean_user_text(text)
        parts.append({"text": text})
    return {"role":entry["role"], "parts": parts}

def chat_about_report(summary_stats: str,history: list,message: str) -> tuple[str,list]:
    chat = client.chats.create(model=MODEL_NAME, 
                               config={"system_instruction": (
                                    "You are a concise data analysis assistant.\n\n"
                                    f"Dataset statistics: {summary_stats}\n\n"
                                    "Reply with one short sentence (max 25 words). If the user asks for details, "
                                    "add at most 2 short bullet points (each 15 words or fewer)."
                                )}, 
                                history= [_to_content(e) for e in (history or [])],)
    response = chat.send_message(message)
    new_history = [
        {"role": c.role, "parts": [{"text": p.text} for p in c.parts if p.text] }
        for c in chat.get_history()
    ]
    return response.text, new_history