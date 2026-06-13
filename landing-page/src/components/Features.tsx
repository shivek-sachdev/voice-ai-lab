const features = [
  {
    title: "Natural voice",
    description:
      "State-of-the-art speech synthesis that sounds warm, clear, and unmistakably human.",
    icon: WaveIcon,
  },
  {
    title: "Real-time responses",
    description:
      "Low-latency conversations with an AI that listens, understands, and replies instantly.",
    icon: BoltIcon,
  },
  {
    title: "Browser-native",
    description:
      "No app download needed. Click, allow your microphone, and start talking in seconds.",
    icon: GlobeIcon,
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-light tracking-tight md:text-4xl">
            Voice AI, reimagined
          </h2>
          <p className="mt-4 text-muted">
            Built on ElevenLabs Agents — the same technology powering the next
            generation of conversational AI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-sm"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <feature.icon />
              </div>
              <h3 className="text-lg font-medium">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
      <path strokeLinecap="round" d="M3 12c2-4 4-6 9-6s7 2 9 6c-2 4-4 6-9 6s-7-2-9-6Z" />
      <path strokeLinecap="round" d="M7 12c1-2 2.5-3 5-3s4 1 5 3" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9c-2.5-2.8-4-6.2-4-9s1.5-6.2 4-9Z" />
    </svg>
  );
}
