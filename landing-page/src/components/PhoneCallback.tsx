"use client";

import { useState, type FormEvent } from "react";

type CallStatus =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

export function PhoneCallback() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<CallStatus>({ state: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = phone.trim();
    if (!trimmed) {
      setStatus({
        state: "error",
        message: "Enter a phone number so the agent knows where to call.",
      });
      return;
    }

    setStatus({ state: "loading" });

    try {
      const response = await fetch("/api/test-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: trimmed }),
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
        message?: string;
      } | null;

      if (!response.ok) {
        setStatus({
          state: "error",
          message:
            data?.error ?? "Something went wrong. Please try again shortly.",
        });
        return;
      }

      setStatus({
        state: "success",
        message:
          "Your phone is ringing now — pick up to talk to the voice agent.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  }

  const isLoading = status.state === "loading";

  return (
    <section
      id="callback"
      className="border-t border-border bg-foreground py-24 text-surface"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Live test call
          </span>
          <h2 className="mt-6 text-3xl font-light tracking-tight md:text-4xl">
            Prefer a phone call?
          </h2>
          <p className="mt-4 text-white/60">
            Enter your phone number and our voice agent will call you directly.
            No app, no waiting — just pick up and talk.
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-md"
          onSubmit={handleSubmit}
          aria-label="Request a test call from the voice agent"
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
              onChange={(event) => setPhone(event.target.value)}
              disabled={isLoading}
              placeholder="+1 415 555 2671"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Calling…
                </>
              ) : (
                "Call me"
              )}
            </button>
          </div>

          <div className="mt-3 min-h-[1.25rem] text-center text-xs" aria-live="polite">
            {status.state === "success" && (
              <p className="text-emerald-400">{status.message}</p>
            )}
            {status.state === "error" && (
              <p className="text-red-400">{status.message}</p>
            )}
            {status.state !== "success" && status.state !== "error" && (
              <p className="text-white/40">
                Use international format, e.g. +14155552671. Standard call rates
                may apply.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
