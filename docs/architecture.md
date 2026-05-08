# Aegis AI — Architecture

## Overview

Aegis AI is a **hackathon-grade emergency healthcare communication OS** with a **React + Tailwind** client and a **Node + Express** API. Safety is enforced by a **rule-based triage floor**; an optional **Groq LLM** polishes wording and intent **without lowering** critical risk.

## High-level diagram

```mermaid
flowchart LR
  subgraph client [React PWA]
    UI[Pages + Components]
    Geo[Geolocation watch]
    Voice[Web Speech API]
  end
  subgraph api [Express API]
    Triage[/api/triage/analyze]
    SOS[/api/emergency/trigger]
    Hosp[/api/hospitals/nearby]
    Report[/api/report/generate]
    Ctx[/api/context/*]
  end
  subgraph intelligence [Intelligence layer]
    Rules[Rule engine + keywords]
    RAG[Context + knowledge snippets]
    LLM[Optional Groq multi-agent JSON]
    TG[Telegram sendMessage]
  end
  UI --> Triage
  UI --> SOS
  UI --> Hosp
  UI --> Report
  UI --> Ctx
  Triage --> Rules
  Triage --> RAG
  Triage --> LLM
  SOS --> TG
```

## Multi-agent simulation (logical modules)

| Module | Responsibility |
|--------|----------------|
| Intent | Maps text → intent category (rules + optional LLM) |
| Summarizer | Short medical-style summary (rules stub + LLM) |
| Risk | LOW / MEDIUM / HIGH / CRITICAL from patterns |
| Guidance | First-aid cards from knowledge base |
| Reply | Empathetic user-facing copy |
| Emergency | SOS payload, maps link, Telegram template |

The implementation **collapses LLM calls** into a **single structured JSON completion** for latency, then **merges** with rules so **CRITICAL cannot be downgraded**.

## Data flow (happy path)

1. User enters symptoms → `POST /api/triage/analyze` with profile context.
2. Backend runs rules → optional Groq → returns JSON + follow-up hints.
3. UI shows risk, first aid, links to SOS / hospitals / report.
4. `POST /api/emergency/trigger` with `sos_manual: true` sends Telegram (if configured) and logs incident.
5. `POST /api/report/generate` builds clinician handoff JSON.

## Storage

Demo uses **in-memory** profile/history (`memoryStore.js`). Swap for PostgreSQL / Mongo in production.

## Deployment notes

- Run **backend** on a host with HTTPS for production; set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_IDS`.
- Run **frontend** static build behind same origin or configure CORS + `VITE_API_URL` if split (currently Vite proxies `/api` in dev).
