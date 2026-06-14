import { NextResponse, type NextRequest } from "next/server";

// E.164: leading "+", first digit 1-9, then up to 14 more digits.
const E164_PATTERN = /^\+[1-9]\d{6,14}$/;

const OUTBOUND_CALL_URL =
  "https://api.elevenlabs.io/v1/convai/twilio/outbound-call";

type OutboundCallResponse = {
  success?: boolean;
  message?: string;
  conversation_id?: string;
  callSid?: string;
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const agentPhoneNumberId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;

  if (!apiKey || !agentId || !agentPhoneNumberId) {
    const missing = [
      !apiKey && "ELEVENLABS_API_KEY",
      !agentId && "ELEVENLABS_AGENT_ID",
      !agentPhoneNumberId && "ELEVENLABS_AGENT_PHONE_NUMBER_ID",
    ].filter(Boolean) as string[];

    const error =
      missing.length === 1 && missing[0] === "ELEVENLABS_AGENT_PHONE_NUMBER_ID"
        ? "No phone number is linked yet. Link a Twilio number in the ElevenLabs dashboard and set ELEVENLABS_AGENT_PHONE_NUMBER_ID."
        : `Outbound calling is not configured. Missing: ${missing.join(", ")}.`;
    return NextResponse.json({ error }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const phoneNumber =
    typeof (payload as { phoneNumber?: unknown })?.phoneNumber === "string"
      ? (payload as { phoneNumber: string }).phoneNumber.trim()
      : "";

  if (!E164_PATTERN.test(phoneNumber)) {
    return NextResponse.json(
      {
        error:
          "Enter a valid phone number in E.164 format, e.g. +14155552671.",
      },
      { status: 400 },
    );
  }

  try {
    const elevenLabsResponse = await fetch(OUTBOUND_CALL_URL, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        agent_phone_number_id: agentPhoneNumberId,
        to_number: phoneNumber,
      }),
    });

    const data = (await elevenLabsResponse
      .json()
      .catch(() => null)) as OutboundCallResponse | null;

    if (!elevenLabsResponse.ok || !data?.success) {
      const message =
        data?.message ||
        `ElevenLabs request failed (status ${elevenLabsResponse.status}).`;
      return NextResponse.json(
        { error: message },
        { status: elevenLabsResponse.status >= 400 ? 502 : 502 },
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message ?? "Call initiated.",
      conversationId: data.conversation_id ?? null,
      callSid: data.callSid ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the calling service. Please try again." },
      { status: 502 },
    );
  }
}
