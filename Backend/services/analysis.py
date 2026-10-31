from models.report import Report
from services.llm import get_gemini_insights


def analysis(df,filename):
    raw_data = df.head(10).to_dict(orient="records")
    stats = df.describe(include="all").to_json()
    ai_insights = get_gemini_insights(stats)

    #Return the Report
    return Report(filename = filename,
                  raw_data = raw_data,
                  summary_stats = stats,
                  ai_insights = ai_insights,
                  chat_history = [])