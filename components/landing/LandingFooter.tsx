import Image from "next/image";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white"
            >
              <Image
                src="/branding/shelby-studio-logo.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-lg"
              />
              Shelby Studio
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              A creator workspace on Shelby: upload, share, go live
              and keep your content in your own wallet.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href="mailto:support@shelbystudio.xyz"
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500/40 hover:text-white"
              >
                support@shelbystudio.xyz
              </a>

              <a
                href="https://x.com/ShelbyStudioHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-blue-500/40 hover:text-white"
              >
                Follow on X ↗
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Product
            </h3>

            <nav className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-white" href="/dashboard">
                Home
              </Link>
              <Link className="block hover:text-white" href="/storage">
                Upload
              </Link>
              <Link className="block hover:text-white" href="/library">
                Library
              </Link>
              <Link className="block hover:text-white" href="/live">
                Go Live
              </Link>
              <Link className="block hover:text-white" href="/explorer">
                Explorer
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Developers
            </h3>

            <nav className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-white" href="/docs">
                Documentation
              </Link>

              <Link className="block hover:text-white" href="/developer">
                Developer Tools
              </Link>

              <Link className="block hover:text-white" href="/playground">
                API Playground
              </Link>

              <a
                className="block hover:text-white"
                href="https://github.com/Daviddforth/shelby-studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Connect
            </h3>

            <nav className="mt-4 space-y-3 text-sm text-slate-500">
              <Link className="block hover:text-white" href="/contact">
                Contact Us
              </Link>

              <a
                className="block hover:text-white"
                href="https://x.com/ShelbyStudioHQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow on X
              </a>

              <a
                className="block hover:text-white"
                href="mailto:support@shelbystudio.xyz"
              >
                Email Support
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Shelby Studio</p>

          <p>Built for the Shelby ecosystem.</p>
        </div>
      </div>
    </footer>
  );
}
