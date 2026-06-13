import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// E.164: a leading "+" followed by 8–15 digits, first digit non-zero.
const E164 = /^\+[1-9]\d{7,14}$/;

type OutboundCallBody = {
  phoneNumber?: unknown;
};

type ElevenLabsOutboundResponse = {
  success?: boolean;
  message?: string;
  conversation_id?: string | null;
  callSid?: string | null;
};

/**
 * Triggers an outbound phone call where the ElevenLabs agent calls the user.
 *
 * The call is placed through ElevenLabs' native Twilio integration. Requires:
 *  - ELEVENLABS_API_KEY                  (secret)
 *  - NEXT_PUBLIC_ELEVENLABS_AGENT_ID     (which agent should talk)
 *  - ELEVENLABS_AGENT_PHONE_NUMBER_ID    (the linked Twilio number to call from)
 */
export async function POST(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const agentPhoneNumberId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID;

  if (!apiKey || !agentId || !agentPhoneNumberId) {
    return NextResponse.json(
      {
        error:
          "Phone calling is not configured. Set ELEVENLABS_API_KEY, NEXT_PUBLIC_ELEVENLABS_AGENT_ID, and ELEVENLABS_AGENT_PHONE_NUMBER_ID.",
      },
      { status: 500 },
    );
  }

  let body: OutboundCallBody;
  try {
    body = (await request.json()) as OutboundCallBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const phoneNumber =
    typeof body.phoneNumber === "string" ? body.phoneNumber.trim() : "";

  if (!E164.test(phoneNumber)) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid phone number in international format, e.g. +15551234567.",
      },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/convai/twilio/outbound-call",
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          agent_id: agentId,
          agent_phone_number_id: agentPhoneNumberId,
          to_number: phoneNumber,
        }),
      },
    );

    const data = (await response
      .json()
      .catch(() => null)) as ElevenLabsOutboundResponse | null;

    if (!response.ok || !data?.success) {
      console.error(
        "ElevenLabs outbound-call failed:",
        response.status,
        data?.message,
      );
      return NextResponse.json(
        { error: "We couldn't place the call right now. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      conversationId: data.conversation_id ?? null,
      callSid: data.callSid ?? null,
    });
  } catch (error) {
    console.error("Error placing outbound call:", error);
    return NextResponse.json(
      { error: "Unexpected error while placing the call." },
      { status: 500 },
    );
  }
}
