# PROMPTS_USED.md

## Overview

This document records the prompts used in the CSVDashboard application for AI-powered features. These are the exact instructions sent to Google Gemini for CSV analysis and chat interactions.

---

## 1. CSV Insights Generation Prompt

**Used in**: `Backend/app.py` → `get_gemini_insights(df, filename)` function  
**Called by**: `POST /upload` endpoint (after CSV upload)  
**Model**: Google Gemini (`gemini-2.5-flash`)

### System Instruction

```
You are a data analyst assistant. Analyze the provided CSV dataset and generate:
1. A concise, actionable one-paragraph summary of key insights (trends, patterns, notable values).
2. A bullet-point list of observations, anomalies, and recommendations.

Keep the response short and professional. Focus on what matters most.
```

### Input Data Sent to LLM

```
DataFrame name: {filename}
Columns: {list of column names}
Data types: {dtype summary}
Shape: {rows} x {columns}

Summary statistics:
{df.describe().to_string()}

Data sample (first 5 rows):
{df.head().to_string()}
```

### Example Call

```python
prompt = f"""Analyze this CSV dataset and provide insights:

File: {filename}
Columns: {', '.join(df.columns.tolist())}
Shape: {df.shape[0]} rows, {df.shape[1]} columns

Summary Statistics:
{df.describe().to_string()}

First few rows:
{df.head().to_string()}

Please provide:
1. A short paragraph summary of key findings.
2. Notable trends, outliers, or recommendations.
"""
```

---

## 2. Chat Follow-up Prompt

**Used in**: `Backend/app.py` → `POST /reports/{report_id}/chat` endpoint  
**Purpose**: Answer user questions about a specific CSV dataset  
**Model**: Google Gemini (`gemini-2.5-flash`)

### System Instruction

```
You are a helpful data analyst. Answer questions about the uploaded CSV dataset concisely.
- Keep responses to one paragraph or a few bullet points.
- Provide specific values from the data when relevant.
- If data is missing or unclear, say so.
- Be professional and direct.
```

### Input Context Sent to LLM

```
Dataset File: {filename}
Columns: {list of column names}
Data types: {dtypes}
Shape: {rows} x {columns}

Chat History:
[Previous user/assistant exchanges]

New User Question: {user_message}
```

### Example Call

```python
system_msg = """You are a data analyst assistant answering questions about a CSV dataset.
Keep responses concise (1 paragraph or bullet points).
Reference specific data values when helpful."""

prompt = f"""
Dataset: {filename}
Columns: {', '.join(df.columns)}
Shape: {df.shape}

Chat History:
{formatted_history}

User: {user_message}
Answer concisely (1-2 sentences or bullets).
"""
```

---

## 3. Fallback/Error Message (No API Call)

**Used in**: `Backend/app.py` → `get_gemini_insights()` function  
**Scenario**: If Gemini API is unavailable or rate-limited

```
"AI analysis currently unavailable, but your data was saved."
```

---

## Prompt Evolution & Iterations

### First Iteration (Initial Development)

- Prompt: "Analyze this CSV. What are the key insights?"
- Issue: Responses were too verbose.

### Second Iteration (Refinement)

- Prompt: "Provide a detailed analysis: [detailed format requested]"
- Issue: Still too long for the frontend UI.

### Final Iteration (Production)

- Prompt: "Provide a short one-paragraph summary, then bullets."
- Solution: Frontend renders only the first paragraph; full text available on request.

---

## Prompt Design Principles

1. **Clarity**: Each prompt explicitly states the expected output format (paragraph, bullets, etc.).
2. **Context**: All prompts include relevant data context (columns, shape, sample rows).
3. **Conciseness**: System instructions emphasize brevity to save tokens and improve UX.
4. **Safety**: No sensitive instructions or assumptions about data content.
5. **Fallback**: Backend gracefully handles API failures with user-friendly messages.

---

## Files Referencing These Prompts

- `Backend/app.py` — Contains both prompts in the `get_gemini_insights()` and chat endpoint.
- `Backend/models.py` — Stores `chat_history` (list of {"role", "parts"} objects).
- `frontend/components/ChatInterface.tsx` — Sends user messages to chat endpoint.
- `frontend/components/InsightsView.tsx` — Renders the first paragraph of insights.

---

**LLM Provider**: Google Gemini (gemini-2.5-flash)  
**Prompt Language**: English  
**Token Usage**: CSV insights ~200-300 tokens per call; chat ~150-250 tokens per exchange
