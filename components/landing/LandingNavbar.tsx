import Link from "next/link";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-20 min-w-0 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          Shelby Studio
        </Link>

        <nav className="hidden items-center gap-5 text-sm text-slate-400 lg:flex">
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
            href="/contact"
            className="transition hover:text-white"
          >
            Contact
          </Link>

          <a
            href="https://x.com/ShelbyStudioHQ"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            X
          </a>

          <a
            href="https://github.com/Daviddforth/shelby-studio"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
        </nav>

        <Link
          href="/dashboard"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Launch Workspace →
        </Link>
      </div>
    </header>
  );
}
