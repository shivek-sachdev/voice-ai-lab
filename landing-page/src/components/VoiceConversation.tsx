"use client";

import {
  ConversationProvider,
  useConversation,
  type Role,
} from "@elevenlabs/react";
import { useCallback, useEffect, useRef, useState } from "react";

type TranscriptEntry = {
  id: string;
  role: Role;
  text: string;
};

type SignedUrlResponse = {
  signedUrl?: string;
  agentId?: string;
  error?: string;
};

type VoiceConversationProps = {
  /** Whether an agent ID is configured. Controls the setup vs. live state. */
  configured: boolean;
};

/**
 * Public entry point. Renders the setup notice until an agent is configured,
 * otherwise mounts the conversation inside its required provider.
 */
export function VoiceConversation({ configured }: VoiceConversationProps) {
  if (!configured) {
    return <SetupNotice />;
  }

  return (
    <ConversationProvider>
      <LiveConversation />
    </ConversationProvider>
  );
}

function LiveConversation() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => setErrorMessage(null),
    onError: (message) => setErrorMessage(humanizeError(message)),
    onMessage: ({ message, role }) => {
      if (!message) return;
      setTranscript((prev) => [
        ...prev,
        { id: `${Date.now()}-${prev.length}`, role, text: message },
      ]);
    },
  });

  const { status, isSpeaking } = conversation;
  const isConnected = status === "connected";
  const isConnecting = status === "connecting" || isStarting;

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startConversation = useCallback(async () => {
    setErrorMessage(null);
    setTranscript([]);
    setIsStarting(true);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const response = await fetch("/api/signed-url");
      const data = (await response.json()) as SignedUrlResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Could not reach the voice service.");
      }

      if (data.signedUrl) {
        await conversation.startSession({ signedUrl: data.signedUrl });
      } else if (data.agentId) {
        await conversation.startSession({ agentId: data.agentId });
      } else {
        throw new Error("No agent credentials were returned.");
      }
    } catch (error) {
      setErrorMessage(humanizeError(error));
    } finally {
      setIsStarting(false);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex min-h-[320px] w-full flex-col items-center">
      <Orb active={isConnected} speaking={isSpeaking} />

      <p className="mt-6 text-sm font-medium" aria-live="polite">
        {isConnecting
          ? "Connecting…"
          : isConnected
            ? isSpeaking
              ? "Agent is speaking"
              : "Listening — go ahead and talk"
            : "Ready when you are"}
      </p>

      {transcript.length > 0 && (
        <div className="mt-5 max-h-44 w-full space-y-2 overflow-y-auto rounded-xl bg-background p-4 text-left text-sm">
          {transcript.map((entry) => (
            <p key={entry.id} className="leading-relaxed">
              <span
                className={
                  entry.role === "agent"
                    ? "font-medium text-accent"
                    : "font-medium text-foreground"
                }
              >
                {entry.role === "agent" ? "Agent" : "You"}:
              </span>{" "}
              <span className="text-muted">{entry.text}</span>
            </p>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      )}

      <div className="mt-6">
        {isConnected ? (
          <button
            type="button"
            onClick={stopConversation}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background"
          >
            <StopIcon />
            End call
          </button>
        ) : (
          <button
            type="button"
            onClick={startConversation}
            disabled={isConnecting}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <MicrophoneIcon />
            {isConnecting ? "Connecting…" : "Start conversation"}
          </button>
        )}
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-4 max-w-sm text-center text-xs text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function Orb({ active, speaking }: { active: boolean; speaking: boolean }) {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      {active && (
        <span
          className={`absolute inset-0 rounded-full bg-accent/20 ${
            speaking ? "animate-ping" : "animate-pulse-soft"
          }`}
        />
      )}
      <span
        className={`relative h-24 w-24 rounded-full bg-gradient-to-br from-accent to-[#93c5fd] transition-transform duration-300 ${
          active ? "scale-100" : "scale-90 opacity-80"
        } ${speaking ? "scale-110" : ""} ${active ? "animate-float" : ""}`}
      />
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background p-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-[#93c5fd] animate-pulse-soft" />
      </div>
      <p className="text-sm font-medium">Voice agent preview</p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Add your ElevenLabs agent ID to{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-xs">
          NEXT_PUBLIC_ELEVENLABS_AGENT_ID
        </code>{" "}
        in{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-xs">
          .env.local
        </code>{" "}
        to enable live conversations.
      </p>
    </div>
  );
}

function humanizeError(error: unknown): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Something went wrong.";

  if (/permission|denied|notallowed/i.test(raw)) {
    return "Microphone access was blocked. Please allow it and try again.";
  }
  if (/device not found|notfound|no.*(microphone|device)/i.test(raw)) {
    return "No microphone was found. Please connect one and try again.";
  }
  if (/network|failed to fetch|signed/i.test(raw)) {
    return "Couldn't connect to the voice service. Please try again.";
  }
  return raw;
}

function MicrophoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.71V21h2v-3.29A7 7 0 0 0 19 11h-2Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden
    >
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
