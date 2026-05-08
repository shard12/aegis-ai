# Aegis AI — Safety & compliance notes

## Non-negotiables

- **No final diagnosis** and **no medication prescribing** in product copy and LLM system prompts.
- **Emergency keywords** force **CRITICAL** and **emergency_triggered**; LLM cannot override downward.
- **Disclaimers** appear in the UI banner and generated reports.
- **First-aid text** is general public-health style; teams should have clinical review before real-world use.

## Regulatory reality (hackathon vs production)

This repository is a **demonstration**. Real deployment requires:

- Clinical governance, local emergency-number integration, data protection (HIPAA/GDPR analogs), and accessibility testing.
- Verified integration with **authorized** alerting systems—not just consumer Telegram bots.

## Telegram

- Never expose bot tokens in frontend builds.
- Chat IDs must be **explicitly opted-in** by recipients.

## Location

- Browser geolocation requires **HTTPS** in production and explicit user consent.

## Recommended judge talking points

- “Rules-first AI”: safe under stress and API outage.
- “Handoff artifact”: structured JSON for EMS/clinic interoperability.
- “Panic UX”: large type, care mode, voice, bilingual.
