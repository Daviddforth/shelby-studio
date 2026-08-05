export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glow */}
      <div className="absolute left-1/2 top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          Built for the Shelby Ecosystem
        </span>

        <h1 className="mt-8 max-w-5xl text-6xl font-extrabold tracking-tight md:text-8xl">
          Build on Shelby.
          <br />
          Not around it.
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-400">
          Shelby Studio is the integrated developer workspace for
          building on the Shelby network. Manage decentralized
          storage, create metadata, organize projects and build
          decentralized applications from one modern platform.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Launch Workspace →
          </a>

          <a
            href="#features"
            className="rounded-xl border border-slate-700 px-8 py-4 font-semibold text-white transition hover:bg-slate-900"
          >
            Explore Features
          </a>
        </div>
      </div>
    </section>
  );
}