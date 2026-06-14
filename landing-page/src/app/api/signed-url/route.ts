import { NextResponse } from "next/server";

// Never cache — signed URLs are short-lived (they expire after ~15 minutes).
export const dynamic = "force-dynamic";

/**
 * Returns the credentials the browser needs to start a conversation.
 *
 * Two modes are supported:
 *  - Private agent (recommended): when `ELEVENLABS_API_KEY` is set, the server
 *    exchanges the key for a short-lived signed URL. The key never reaches the
 *    browser.
 *  - Public agent: when no key is configured we fall back to handing the agent
 *    ID to the client, which only works if the agent has authentication
 *    disabled in the ElevenLabs dashboard.
 */
export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not configured." },
      { status: 500 },
    );
  }

  // No API key: assume the agent is public and let the client connect directly.
  if (!apiKey) {
    return NextResponse.json({ agentId });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: { "xi-api-key": apiKey },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("ElevenLabs signed-url request failed:", response.status, detail);
      return NextResponse.json(
        { error: "Failed to generate a signed URL from ElevenLabs." },
        { status: 502 },
      );
    }

    const data = (await response.json()) as { signed_url?: string };
    if (!data.signed_url) {
      return NextResponse.json(
        { error: "ElevenLabs did not return a signed URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error("Error requesting signed URL:", error);
    return NextResponse.json(
      { error: "Unexpected error while contacting ElevenLabs." },
      { status: 500 },
    );
  }
}
