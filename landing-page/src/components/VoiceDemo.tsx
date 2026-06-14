import { VoiceConversation } from "./VoiceConversation";

type VoiceDemoProps = {
  agentId?: string;
};

export function VoiceDemo({ agentId }: VoiceDemoProps) {
  return (
    <section id="demo" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-accent">Live demo</p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
              Try the voice agent now
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Click the button below and start a natural voice conversation. Ask
              questions, get answers, and experience what AI-powered speech feels
              like — all in your browser.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-3">
                <StepBadge n={1} />
                Allow microphone access when prompted
              </li>
              <li className="flex items-start gap-3">
                <StepBadge n={2} />
                Tap &ldquo;Start conversation&rdquo; to begin
              </li>
              <li className="flex items-start gap-3">
                <StepBadge n={3} />
                Speak naturally — the agent listens and responds
              </li>
            </ul>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-accent/10 to-accent-soft/40 blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <VoiceConversation configured={Boolean(agentId)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
      {n}
    </span>
  );
}
