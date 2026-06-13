# Voice Agent Landing Page

A modern landing page prototype for an ElevenLabs-powered voice agent. Visitors can talk to the AI directly in their browser, with a coming-soon section for phone callback.

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

1. Create an agent at [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)
2. In **Advanced** settings, disable authentication (required for the embed widget)
3. In **Security**, add your domain to the allowlist (e.g. `localhost` for dev)
4. Copy your agent ID into `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in `.env.local`

## Project structure

```
landing-page/
├── src/
│   ├── app/           # Next.js app router
│   └── components/    # Landing page sections
└── .env.example       # Environment variable template
```

## Coming soon

- Phone callback: enter your number and the agent calls you directly
