"use client";

import { useState } from "react";

type PhoneCallbackProps = {
  /** When false, the form is shown as a "coming soon" preview. */
  enabled: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";

export function PhoneCallback({ enabled }: PhoneCallbackProps) {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enabled || status === "submitting") return;

    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/outbound-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone.trim() }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Calling you now — please keep your phone nearby.");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the calling service. Please try again.");
    }
  };

  return (
    <section
      id="callback"
      className="border-t border-border bg-foreground py-24 text-surface"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {!enabled && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
              Coming soon
            </span>
          )}
          <h2 className="mt-6 text-3xl font-light tracking-tight md:text-4xl">
            Prefer a phone call?
          </h2>
          <p className="mt-4 text-white/60">
            {enabled
              ? "Enter your phone number and our voice agent will call you directly. No app, no waiting — just pick up and talk."
              : "Soon you'll be able to enter your phone number and our voice agent will call you directly. No app, no waiting — just pick up and talk."}
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-md"
          onSubmit={handleSubmit}
          aria-label="Request a phone call from the voice agent"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="phone" className="sr-only">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!enabled || status === "submitting"}
              required={enabled}
              placeholder="+1 555 123 4567"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:border-white/30 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!enabled || status === "submitting"}
              className="rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "Calling…" : "Call me"}
            </button>
          </div>

          {enabled ? (
            <p
              role={status === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`mt-3 text-center text-xs ${
                status === "success"
                  ? "text-green-400"
                  : status === "error"
                    ? "text-red-400"
                    : "text-white/40"
              }`}
            >
              {message ??
                "Use international format with your country code (e.g. +15551234567)."}
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-white/40">
              Phone callback is not available yet. This is a preview of what&apos;s
              next.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
