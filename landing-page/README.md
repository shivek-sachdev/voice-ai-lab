# Voice Agent Landing Page

A modern landing page prototype for an ElevenLabs-powered voice agent. Visitors can talk to the AI directly in their browser, or enter their phone number to get a live outbound test call from the agent.

## Design

Inspired by [ElevenLabs Agents](https://elevenlabs.io/agents) branding:

- **Black & white** core palette for typography and surfaces
- **Blue** (`#2563eb`) accent — the ElevenAgents primary color
- Off-white background (`#f5f5f5`) with soft gradient orbs

## Getting started

```bash
cd landing-page
npm install
cp .env.example .env.local
# Add your ElevenLabs agent ID to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ElevenLabs setup

### Browser voice widget

1. Create an agent at [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)
2. In **Advanced** settings, disable authentication (required for the embed widget)
3. In **Security**, add your domain to the allowlist (e.g. `localhost` for dev)
4. Copy your agent ID into `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in `.env.local`

### Outbound telephony (the "Call me" test call)

The phone-callback section places a real outbound call through the
[ElevenLabs Twilio outbound-call API](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration).
To enable it:

1. **Link a phone number.** In the ElevenLabs dashboard, open **Phone Numbers**
   and import a Twilio number (or add a verified Twilio caller ID for
   outbound-only). See the
   [Twilio native integration guide](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration).
2. **Attach an outbound agent.** Create or pick the agent that should drive the
   conversation and give it a clear `first_message`, since the agent speaks
   first on outbound calls.
3. **Collect the IDs and key** and add them to `.env.local`:
   - `ELEVENLABS_API_KEY` — from
     [API keys](https://elevenlabs.io/app/settings/api-keys) (server-side secret)
   - `ELEVENLABS_AGENT_ID` — the outbound agent's ID
   - `ELEVENLABS_AGENT_PHONE_NUMBER_ID` — the linked number's ID from the
     Phone Numbers tab
4. Restart `npm run dev`, enter a number in E.164 format (e.g. `+14155552671`)
   in the **Prefer a phone call?** section, and click **Call me**.

> If these variables are missing, the `/api/test-call` route responds with a
> clear "not configured" message instead of attempting a call.

#### Creating agents with the ElevenLabs MCP server

You can provision the outbound agent and inspect phone numbers from your editor
using the official
[ElevenLabs MCP server](https://github.com/elevenlabs/elevenlabs-mcp).

This repo ships a ready-to-use config at [`.cursor/mcp.json`](../.cursor/mcp.json)
(repo root) that launches the server via `uvx elevenlabs-mcp`. It reads your key
from the `ELEVENLABS_API_KEY` environment variable, so **no secret is committed
to git**. Prerequisites:

- [`uv`](https://github.com/astral-sh/uv) installed (`uvx` must be on `PATH`).
- `ELEVENLABS_API_KEY` available to the editor:
  - **Cursor Desktop:** set it in your shell/login environment, or replace the
    `${ELEVENLABS_API_KEY}` placeholder in your local MCP config with the key.
  - **Cursor Cloud Agents:** add `ELEVENLABS_API_KEY` under
    **Dashboard → Cloud Agents → Secrets** so it is injected into the agent VM.

Once connected, ask the agent (using the MCP tools) to create the outbound
agent, set its system prompt and `first_message`, then read back the `agent_id`
and linked `agent_phone_number_id` to drop into `.env.local`.

> **Note:** The MCP server is a *client-side editor tool*, not part of this web
> app's runtime. The landing page's "Call me" button always uses the
> server-side `/api/test-call` route and the REST API above — it does not depend
> on the MCP.

## How the test call works

```
PhoneCallback (client)
  └─ POST /api/test-call  { phoneNumber }
       └─ src/app/api/test-call/route.ts (server)
            └─ POST https://api.elevenlabs.io/v1/convai/twilio/outbound-call
                 { agent_id, agent_phone_number_id, to_number }
```

The API key never reaches the browser; it is only read server-side in the route
handler.

## Project structure

```
landing-page/
├── src/
│   ├── app/
│   │   ├── api/test-call/  # Outbound call route handler
│   │   └── ...             # Next.js app router pages
│   └── components/         # Landing page sections
└── .env.example            # Environment variable template
```
