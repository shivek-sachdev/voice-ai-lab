# Voice Agent Landing Page

A modern landing page prototype for an ElevenLabs-powered voice agent. Visitors can talk to the AI directly in their browser, with a coming-soon section for phone callback.

## Design

Inspired by [ElevenLabs Agents](https://elevenlabs.io/agents) branding:

- **Black & white** core palette for typography and surfaces
- **Blue** (`#2563eb`) accent — the ElevenAgents primary color
- Off-white background (`#f5f5f5`) with soft gradient orbs

The browser voice experience is built on the official
[`@elevenlabs/react`](https://elevenlabs.io/docs/eleven-agents/libraries/react)
SDK with a custom UI (animated orb, live transcript, status, error handling).
Authentication uses a **server-side signed URL** so your API key never reaches
the browser.

## Getting started

```bash
cd landing-page
npm install
cp .env.example .env.local
# Add your ElevenLabs credentials to .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## ElevenLabs setup

1. Create an account at [elevenlabs.io](https://elevenlabs.io) and create an agent at
   [Agents](https://elevenlabs.io/app/conversational-ai).
2. Copy the **agent ID** into `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in `.env.local`.
3. **Recommended (private agent):** create an **API key**
   (Profile → API Keys) and set `ELEVENLABS_API_KEY` in `.env.local`. The app's
   `/api/signed-url` route exchanges this key for a short-lived signed URL, so
   the key stays on the server.
4. **Alternative (public agent):** leave `ELEVENLABS_API_KEY` blank, disable
   authentication for the agent in its **Advanced** settings, and add your domain
   to the **Security** allowlist (`localhost` for dev). The browser then connects
   with just the agent ID.

### What you need to pay for

- **Creating an agent is free.** Every account (including the **Free** plan)
  includes a small bundle of **agent minutes** (~15 min/month on Free) so you can
  prototype without entering a card.
- **To go beyond the bundle you must add a payment method** (Credit Card, Apple
  Pay, or Google Pay) and either subscribe to a paid plan or enable Pay-As-You-Go
  credits. Overage is billed at roughly **$0.08/min**, and the underlying **LLM
  token cost is passed through separately**.
- Pricing changes over time — confirm current numbers on the
  [ElevenLabs Agents pricing page](https://elevenlabs.io/pricing/agents). Early
  startups can also apply for the [ElevenLabs Grants](https://elevenlabs.io/startup-grants)
  program for free credits.

## Phone callback (agent calls the user)

The "Prefer a phone call?" section can place a real outbound call where your
agent calls the visitor, via ElevenLabs' native
[Twilio integration](https://elevenlabs.io/docs/eleven-agents/phone-numbers/twilio-integration/native-integration).

Setup:

1. Create a [Twilio](https://twilio.com) account and either **buy a Twilio
   number** (needed for inbound too) or add your existing number as a
   **Verified Caller ID** (outbound only).
2. In the ElevenLabs dashboard → **Phone Numbers**, import/link that number to
   your agent and copy its **phone number ID**.
3. In `.env.local`, set `ELEVENLABS_AGENT_PHONE_NUMBER_ID`, ensure
   `ELEVENLABS_API_KEY` + `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` are set, and flip
   `NEXT_PUBLIC_ELEVENLABS_PHONE_ENABLED=true`.

The form posts to `/api/outbound-call`, which calls ElevenLabs server-side
(`POST /v1/convai/twilio/outbound-call`) so your API key never reaches the
browser. Numbers must be entered in **E.164** format (e.g. `+15551234567`).

> **Billing note:** outbound calls incur **both** ElevenLabs agent minutes and
> **Twilio** telephony charges (number rental + per-minute), billed separately.
> Automated outbound calling is also subject to TCPA/consent regulations.

## Project structure

```
landing-page/
├── src/
│   ├── app/
│   │   ├── api/signed-url/      # Server route: API key → short-lived signed URL
│   │   ├── api/outbound-call/   # Server route: trigger agent → user phone call
│   │   └── ...                  # Next.js app router pages
│   └── components/
│       ├── VoiceConversation.tsx   # SDK-powered browser voice UI
│       └── PhoneCallback.tsx       # Outbound phone-call form
└── .env.example                # Environment variable template
```
