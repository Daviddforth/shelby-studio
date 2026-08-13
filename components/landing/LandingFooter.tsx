import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-base font-semibold tracking-tight text-white"
            >
              Shelby Studio
            </Link>

            <p className="mt-1.5 text-sm text-slate-500">
              A creator and developer workspace for Shelby.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Workspace
            </Link>

            <Link
              href="/docs"
              className="transition hover:text-white"
            >
              Docs
            </Link>

            <a
              href="https://github.com/Daviddforth/shelby-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Shelby Studio</p>

          <p>Built for the Shelby ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
