export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
        <p>Voice AI prototype — built with ElevenLabs Agents</p>
        <p className="text-xs">
          Not affiliated with ElevenLabs. For experimentation purposes only.
        </p>
      </div>
    </footer>
  );
}
