export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white mt-16">

      <div className="max-w-7xl mx-auto px-8 py-10">

        <h2 className="text-2xl font-bold">
          Shelby NFT Metadata Manager
        </h2>

        <p className="mt-2 text-blue-100">
          Built with Next.js, React, TypeScript and Tailwind CSS.
        </p>

        <p className="mt-4 text-blue-100">
          Designed for the Shelby Protocol ecosystem to simplify NFT metadata creation.
        </p>

        <div className="border-t border-blue-500 mt-8 pt-6 flex flex-col md:flex-row md:justify-between gap-3">

          <span>
            © 2026 David Ajoma
          </span>

          <span>
            Built for Shelby Protocol 💙
          </span>

        </div>

      </div>

    </footer>
  );
}