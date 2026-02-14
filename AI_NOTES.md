# AI_NOTES.md

## Summary

This project uses **Google Gemini** (via the `google-generativeai` SDK) for AI-powered features. Development and debugging were assisted by GitHub Copilot.

## AI Usage in the Application

### 1. CSV Insights Generation

- **Purpose**: Analyze uploaded CSV data and generate short, actionable insights.
- **LLM**: Google Gemini (`gemini-2.5-flash` model).
- **Endpoint**: `POST /upload`, `GET /reports/{id}`.
- **Prompt**: Backend sends Pandas DataFrame summary stats and column names to Gemini with a prompt requesting:
  - One short paragraph summary (first).
  - Then a bullet-list of trends, outliers, and recommendations.
- **Why Gemini**: Free tier, fast inference, supports structured text output, good for data analysis tasks.

### 2. Chat Follow-ups

- **Purpose**: Allow users to ask follow-up questions about their dataset (e.g., "What's the highest value in column X?").
- **LLM**: Google Gemini (`gemini-2.5-flash` model).
- **Endpoint**: `POST /reports/{id}/chat`.
- **Prompt**: Chat history + new user message + system instruction for concise, single-paragraph replies.
- **Why Gemini**: Same as above; handles chat history and context well.

## AI Usage in Development

### 1. Code Generation & Assistance (GitHub Copilot)

- Generated initial boilerplate for FastAPI app structure.
- Suggested React component layouts (Sidebar, InsightsView, ChatInterface, VisualizationsView).
- Assisted with Next.js configuration and TypeScript patterns.
- Helped debug async/await patterns and API request handling.

### 2. Documentation & Comments

- Copilot suggested docstrings and inline comments in several files.
- Assisted in creating the `README.md` structure.

## Manual Verification & Debugging

The following were manually checked and debugged by the developer:

1. **Database Connectivity**
   - Verified PostgreSQL connection via `SELECT 1` test.
   - Diagnosed missing `psycopg2-binary` and `sqlalchemy_utils` packages; installed them.
   - Confirmed `DATABASE_URL` env var setup in `.env`.

2. **API Endpoint Testing**
   - Tested `/health`, `/upload`, `/reports/recent`, `/reports/{id}`, `/reports/{id}/chat` manually.
   - Fixed route ordering bug (placed `/reports/recent` before `/reports/{id}` to avoid 422 errors).
   - Verified full report objects were returned (not partial responses).

3. **LLM Model Selection**
   - Listed available Gemini models via API.
   - Tested `gemini-2.5-flash` for availability and performance.
   - Confirmed model name and updated backend endpoint.

4. **Frontend Rendering**
   - Debugged ChatInterface message parsing (extracted text safely from `m.parts` array).
   - Fixed form submit button behavior.
   - Created and integrated `VisualizationsView` (Recharts charts).
   - Added numeric type coercion for chart data (strings → numbers).
   - Added `index` field for X-axis in charts.

5. **Database Schema & ORM**
   - Reviewed `models.py` and `db.py` for correct JSONB column definitions.
   - Verified `Report` model structure and JSON serialization.

6. **Environment & Secret Management**
   - Scanned repo for accidentally committed `.env` files.
   - Added `.gitignore` patterns for secrets.
   - Created `.env.example` files with placeholders.

7. **Deployment Readiness**
   - Verified `requirements.txt` includes all Python dependencies.
   - Documented setup steps for local dev (venv, install, env setup).
   - Prepared deployment guidance for Render/Vercel.

## LLM Provider Rationale

### Google Gemini (Chosen)

- **Pros**: Free tier, fast response times, good for text analysis, handles JSON/structured output well, API is straightforward.
- **Cons**: Rate-limited on free tier; suitable for small-scale apps.
- **Model Selected**: `gemini-2.5-flash` — fast, cost-effective inference for this use case.

### Alternatives Considered

- **OpenAI (GPT-4/3.5-turbo)**: Would require paid API key; better for complex reasoning but overkill for CSV analysis summaries.
- **Anthropic Claude**: Similar to OpenAI; paid tier required.
- **Local LLM (Ollama/Llama2)**: Would need GPU/server resources; complexity not justified for this scope.

## Key Decisions

1. **Prompt Engineering**: Revised prompts iteratively to produce concise one-paragraph summaries first, followed by bullets (frontend renders first paragraph only).
2. **Chat History Format**: Stored as JSONB with `{"role": "user/assistant", "parts": [text]}` structure for compatibility with Gemini API.
3. **Error Handling**: If Gemini API unavailable, backend returns fallback message; frontend gracefully handles missing insights.

## Files Using AI

- `Backend/app.py` — Gemini API integration (`get_gemini_insights()` function, chat endpoint).
- `frontend/components/InsightsView.tsx` — Renders AI-generated insights and visualizations.
- `frontend/components/ChatInterface.tsx` — Displays chat history and sends messages to backend.

---

**AI Assistant Used**: GitHub Copilot (for code generation, debugging suggestions)  
**Production LLM**: Google Gemini (gemini-2.5-flash)
