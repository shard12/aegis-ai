# Aegis AI — API Specification

Base URL (dev): `http://localhost:5000`

## `POST /api/triage/analyze`

**Body (JSON)**

| Field | Type | Required |
|-------|------|----------|
| `message` | string | yes |
| `context` | object | no — `age`, `allergies[]`, `profileName`, `previousMessages[]`, etc. |

**Response**

Returns `{ ok: true, ... }` with at least:

- `intent`, `risk_level`, `confidence`, `why_risk`
- `medical_summary`, `possible_concerns[]`, `suggested_response`, `recommended_action`
- `rag_context_used`, `emergency_triggered`, `telegram_alert`
- `follow_up_questions[]`, `critical_labels[]`, `engine` (`rules` | `hybrid`)

## `POST /api/emergency/trigger`

**Body**

| Field | Type |
|-------|------|
| `message` | string |
| `context` | object |
| `triage` | object — result from analyze (or minimal manual object) |
| `lat`, `lng` | number (optional) |
| `maps_url` | string (optional) |
| `contacts` | string[] |
| `sos_manual` | boolean — if true, Telegram sends even if not CRITICAL (demo) |

**Response:** `{ ok, emergency, telegram, maps_url }`

## `POST /api/hospitals/nearby`

**Body:** `{ lat?, lng?, limit? }`  
**Response:** `{ ok, hospitals: [{ id, name, type, phone, city, maps_url, distance_km }] }`

## `POST /api/report/generate`

**Body:** `{ triage, patient, location: { lat, lng }, contacts_alerted[], telegram_sent }`  
**Response:** `{ ok, report }` — includes `structured_json` for integrations.

## `POST /api/context/save`

**Body:** arbitrary profile fields; merged by `id` (default `default`).  
**Response:** `{ ok, profile }`

## `GET /api/context/history?limit=50`

**Response:** `{ ok, history: [...] }`

## `GET /health`

**Response:** `{ ok: true, service: 'aegis-ai-backend' }`
