"use client";

export function PhoneCallback() {
  return (
    <section id="callback" className="border-t border-border bg-foreground py-24 text-surface">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
            Coming soon
          </span>
          <h2 className="mt-6 text-3xl font-light tracking-tight md:text-4xl">
            Prefer a phone call?
          </h2>
          <p className="mt-4 text-white/60">
            Soon you&apos;ll be able to enter your phone number and our voice agent
            will call you directly. No app, no waiting — just pick up and talk.
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-md"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Phone callback signup (coming soon)"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="phone" className="sr-only">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              disabled
              placeholder="Enter your phone number"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled
              className="rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Call me
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/40">
            Phone callback is not available yet. This is a preview of what&apos;s next.
          </p>
        </form>
      </div>
    </section>
  );
}
