import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Shelby Studio
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="transition hover:text-white"
          >
            Workflow
          </a>

          <Link
            href="https://github.com/Daviddforth/shelby-studio"
            target="_blank"
            className="transition hover:text-white"
          >
            GitHub
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Launch Workspace →
        </Link>
      </div>
    </header>
  );
}