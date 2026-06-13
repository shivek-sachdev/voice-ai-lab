export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-surface">
            <span className="flex gap-0.5">
              <span className="h-3.5 w-0.5 rounded-full bg-surface" />
              <span className="h-3.5 w-0.5 rounded-full bg-surface" />
            </span>
          </span>
          <span className="text-sm font-semibold tracking-tight">VoiceAgent</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#demo" className="transition-colors hover:text-foreground">
            Try it
          </a>
          <a href="#callback" className="transition-colors hover:text-foreground">
            Phone callback
          </a>
        </nav>

        <a
          href="#demo"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-foreground/90"
        >
          Start talking
        </a>
      </div>
    </header>
  );
}
