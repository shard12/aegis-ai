# Aegis AI — Smart Healthcare Communication & Emergency Response OS

## Quick start

```bash
# Terminal 1 — API
cd backend
cp .env.example .env   # add GROQ_API_KEY / Telegram vars optionally
npm install
npm run dev

# Terminal 2 — UI
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The UI proxies `/api` to `http://localhost:5000`.

## Environment (backend)

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default 5000) |
| `GROQ_API_KEY` | Optional LLM polish (rules always run) |
| `TELEGRAM_BOT_TOKEN` | Bot token |
| `TELEGRAM_CHAT_IDS` | Comma-separated chat IDs |

## Docs

- `docs/architecture.md` — system design & agent map  
- `docs/api-spec.md` — REST contract  
- `docs/demo-script.md` — judge flow  
- `docs/safety-notes.md` — disclaimers & limits  

## Production

Build UI: `cd frontend && npm run build` → serve `dist/` over HTTPS. Run API with the same origin or set CORS + absolute API base in `frontend/src/services/api.js`.
