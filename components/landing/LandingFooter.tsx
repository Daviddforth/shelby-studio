import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white"
            >
              Shelby Studio
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              The integrated developer workspace for building on Shelby.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
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
              Documentation
            </Link>

            <a
              href="https://github.com/Daviddforth/shelby-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Shelby Studio
          </p>

          <p>
            Built for the Shelby ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}