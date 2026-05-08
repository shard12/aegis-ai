# Aegis AI — 2-minute demo script

## Prereqs

1. Terminal A: `cd backend && npm install && npm run dev` (or `npm start`)
2. Terminal B: `cd frontend && npm install && npm run dev`
3. Optional: set `GROQ_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_IDS` in `backend/.env`

## Narration (dramatic flow)

1. **Landing** — “This is Aegis AI: calm UI, one-tap help. Notice disclaimer and bilingual switch.”
2. **I NEED HELP NOW** → opens triage.
3. Type: **“crushing chest pain and sweating for 10 minutes.”**
4. Answer follow-ups quickly (severity, allergies).
5. **Risk** shows **CRITICAL** with explanation — not a diagnosis, escalation language.
6. **First aid** cards appear; mention offline rules still work if LLM fails.
7. **Open SOS center** — allow location → **Google Maps** link; tap **SOS** → Telegram fires if configured.
8. **Hospitals** — distance-sorted demo facilities.
9. **Reports** — generate **doctor handoff** JSON; copy to clipboard.
10. **Profiles** — show allergies + contacts feeding RAG context.

## Backup line if API is down

Trigger triage with airplane mode on LLM only — rule engine still elevates red flags; show **offline fallback** copy.
