# CSVDashboard

Lightweight CSV insights dashboard (frontend + FastAPI backend).

## Overview

- Backend: FastAPI app that accepts CSV uploads, stores reports in Postgres, runs lightweight analysis (Pandas), and calls Gemini (Google) for AI insights.
- Frontend: Next.js (App Router) React app that lets users upload CSVs, view AI insights, visualizations, and chat with the dataset.

## Repository structure

- `Backend/` — FastAPI backend
  - `app.py` — main FastAPI app and endpoints
  - `db.py` — SQLAlchemy engine & session
  - `models.py` — DB models (Report)
  - `requirements.txt` — Python dependencies (created)
  - `.env` — local environment variables (not committed)
- `frontend/` — Next.js frontend
  - `app/` — Next.js pages (`page.tsx`, `globals.css`)
  - `components/` — React components (Sidebar, InsightsView, ChatInterface, VisualizationsView)

  # CSVDashboard — Project Notes & README

  ## Summary

  This project is a CSV Dashboard (Problem B) — a web app that lets users upload CSVs, preview the table, generate short AI insights (trends, outliers, recommendations), save reports, view recent reports, and export results.

  ## Project Snapshot
  - Chosen problem: CSV Dashboard (quicker to complete than Task Generator)
  - Tech stack: Python (FastAPI), PostgreSQL, SQLAlchemy, Pandas, Google Gemini (generative AI), Next.js (React), Recharts

  ## Project Definition

  Build a web app with:
  1. Upload a CSV file
  2. Preview the data table
  3. Generate a short insight summary (trends, outliers, what to check next)
  4. Save the report and show recent reports (last 5)
  5. Export the report

  ## Status Notes (development log)
  - Datetime: 12/02/2026 02:24 PM — Project defined
  - Datetime: 12/02/2026 04:34 PM — Requirements clarified

  ## Implementation overview

  Database (Done)
  - SQLAlchemy + PostgreSQL
  - `db.py` reads `DATABASE_URL` from `.env`, creates engine, sessionmaker, and `Base`
  - `models.py` defines a `Report` model with `raw_data`, `summary_stats`, `ai_insights`, and `chat_history` stored as JSONB

  Backend (Done)
  - `app.py` (FastAPI) implements:
    - `/health` — service health check (DB connectivity)
    - `/upload` — accept CSV upload, parse with Pandas, compute `describe()`, call Gemini for insights, save `Report` in DB
    - `/reports/recent` — return recent reports (limit 10)
    - `/reports/{id}` — return a single report
    - `/reports/{id}/chat` — chat follow-ups using Gemini with history stored in DB

  Frontend (Done)
  - Next.js app with components:
    - `Sidebar` — recent reports and selection
    - `InsightsView` — shows one-paragraph summary (short) and visualizations
    - `VisualizationsView` — Recharts-based charts (bar, line, scatter) auto-extracted from numeric columns
    - `ChatInterface` — follow-up chat UI

  ## Development setup

  Prerequisites: Python 3.10+, Node 18+, PostgreSQL (for production)

  Backend (local):

  ```bash
  cd Backend
  python -m venv .venv
  # Windows: .venv\\Scripts\\activate
  # macOS/Linux: source .venv/bin/activate
  pip install -r requirements.txt
  cp .env.example .env  # configure DATABASE_URL and GEMINI_API_KEY
  uvicorn app:app --reload --host 0.0.0.0 --port 8000
  ```

  Frontend (local):

  ```bash
  cd frontend
  npm install
  npm run dev
  # open http://localhost:3000
  ```

  ## Deployment guidance
  - Backend: use Render/Railway/Heroku or Cloud Run with production Postgres. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`.
  - Frontend: deploy to Vercel and set `NEXT_PUBLIC_API_BASE` to the backend URL.

  ## Notes & Recommendations
  - Keep `Backend/test_api.py` only for local debugging; remove before production or move to `scripts/`.
  - Use hosted Postgres for production; avoid SQLite for deployed apps.
  - Store secrets (`GEMINI_API_KEY`, DB URL) in platform environment variables.

  ## Files of interest
  - `Backend/app.py`, `Backend/db.py`, `Backend/models.py`
  - `frontend/app/page.tsx`, `frontend/components/*`, `frontend/lib/api.ts`

  ## Ignored secret files
  - The repository intentionally ignores environment and secret files to avoid accidental commits. Patterns added to `.gitignore` include: `.env*`, `.env.local`, `.env.*.local`, `secrets/`, `secrets.json`, `*.key`, `*.secret`, and `credentials`.
  
  ## Example env files
  - Example environment files have been added for local setup:
    - `Backend/.env.example` — backend variables (`DATABASE_URL`, `GEMINI_API_KEY`, `PORT`).
    - `frontend/.env.example` — frontend variables (`NEXT_PUBLIC_API_BASE`, feature flags).
  - Usage (copy and fill values):
    - macOS/Linux:
      ```bash
      cp Backend/.env.example Backend/.env
      cp frontend/.env.example frontend/.env
      ```
    - Windows (PowerShell):
      ```powershell
      Copy-Item Backend\.env.example Backend\.env
      Copy-Item frontend\.env.example frontend\.env
      ```
  - Keep real `.env` files out of version control — the repo `.gitignore` already excludes them.
