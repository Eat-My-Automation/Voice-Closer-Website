# VoiceCloser

A landing page for VoiceCloser — a 24/7 AI voice agent service that answers calls and follows up on leads.

## Architecture

- **Frontend**: Astro v6 static site (built to `dist/`)
- **Backend**: Express.js server (`server.js`) that serves the built Astro output and exposes API routes
- **Runtime**: Node.js 22

## Development

The dev workflow runs the Astro dev server directly on port 5000:
```
npm run dev
```

## Production

Build Astro, then run the Express server:
```
npm run build
node server.js
```

The Express server defaults to `PORT` env var or 3000.

## API

### POST /api/trigger-call
Triggers a demo call via the Retell AI API.
- Body: `{ phone, agent? }`
- Requires env vars: `RETELL_API_KEY`, `RETELL_FROM_NUMBER`, and `AGENT_*` vars per agent

## Environment Variables

| Variable | Description |
|---|---|
| `RETELL_API_KEY` | Retell AI API key |
| `RETELL_FROM_NUMBER` | Phone number to call from (E.164) |
| `AGENT_VOICECLOSER_DEMO` | Retell agent ID for demo calls |
| `AGENT_CITY_FITNESS_REACTIVATION` | Retell agent ID for City Fitness |
| `AGENT_CRE_COLD_CALLER` | Retell agent ID for CRE cold calling |
| `AGENT_LIMITLESS_STORAGE` | Retell agent ID for Limitless Storage |

## Deployment

Configured as autoscale deployment:
- Build: `npm run build`
- Run: `node server.js`
