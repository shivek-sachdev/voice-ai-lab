"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          variant?: string;
          "avatar-orb-color-1"?: string;
          "avatar-orb-color-2"?: string;
          "action-text"?: string;
          "start-call-text"?: string;
          "end-call-text"?: string;
          "listening-text"?: string;
          "speaking-text"?: string;
        },
        HTMLElement
      >;
    }
  }
}

type ElevenLabsWidgetProps = {
  agentId?: string;
  variant?: "expanded" | "compact";
};

export function ElevenLabsWidget({
  agentId,
  variant = "expanded",
}: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !agentId) return;

    container.innerHTML = "";

    const widget = document.createElement("elevenlabs-convai");
    widget.setAttribute("agent-id", agentId);
    widget.setAttribute("variant", variant);
    widget.setAttribute("avatar-orb-color-1", "#2563eb");
    widget.setAttribute("avatar-orb-color-2", "#93c5fd");
    widget.setAttribute("action-text", "Talk to our voice agent");
    widget.setAttribute("start-call-text", "Start conversation");
    widget.setAttribute("end-call-text", "End call");
    widget.setAttribute("listening-text", "Listening...");
    widget.setAttribute("speaking-text", "Agent is speaking");

    container.appendChild(widget);
  }, [agentId, variant]);

  if (!agentId) {
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
          in <code className="rounded bg-surface px-1.5 py-0.5 text-xs">.env.local</code>{" "}
          to enable live conversations.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
      <div ref={containerRef} className="min-h-[320px] w-full" />
    </>
  );
}
