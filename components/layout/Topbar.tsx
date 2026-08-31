"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Bot,
  Boxes,
  Code2,
  Database,
  FileJson,
  FolderKanban,
  Images,
  Info,
  LayoutDashboard,
  Search,
  TerminalSquare,
  UserCircle2,
  X,
} from "lucide-react";

import ConnectWallet from "../wallet/ConnectWallet";
import { useWallet } from "@/context/WalletContext";

const searchablePages = [
  {
    title: "Dashboard",
    description: "Shelby Studio workspace overview",
    href: "/dashboard",
    keywords: ["home", "overview", "workspace"],
    icon: LayoutDashboard,
  },
  {
    title: "Portfolio",
    description: "View your digital asset portfolio",
    href: "/portfolio",
    keywords: ["nft", "assets", "wallet"],
    icon: Images,
  },
  {
    title: "Storage",
    description: "Upload and manage Shelby Storage assets",
    href: "/storage",
    keywords: ["upload", "files", "shelby storage", "blob"],
    icon: Database,
  },
  {
    title: "Asset Explorer",
    description: "Browse stored Shelby assets",
    href: "/explorer",
    keywords: ["explorer", "asset", "files", "download"],
    icon: Search,
  },
  {
    title: "Metadata",
    description: "Create and manage NFT metadata",
    href: "/metadata",
    keywords: ["json", "nft", "attributes", "metadata generator"],
    icon: FileJson,
  },
  {
    title: "Collections",
    description: "Create and manage collections",
    href: "/collections",
    keywords: ["collection", "nft collection", "creator"],
    icon: FolderKanban,
  },
  {
    title: "Developer",
    description: "Shelby developer tools",
    href: "/developer",
    keywords: ["sdk", "api", "code", "developer"],
    icon: Code2,
  },
  {
    title: "Documentation",
    description: "Shelby Studio guides and documentation",
    href: "/docs",
    keywords: ["docs", "guide", "help"],
    icon: Boxes,
  },
  {
    title: "AI",
    description: "Shelby Studio AI tools",
    href: "/ai",
    keywords: ["assistant", "ai", "chat"],
    icon: Bot,
  },
  {
    title: "Playground",
    description: "Experiment with developer workflows",
    href: "/playground",
    keywords: ["test", "api", "sdk", "experiment"],
    icon: TerminalSquare,
  },
  {
    title: "Profile",
    description: "Manage your creator profile",
    href: "/profile",
    keywords: ["account", "wallet", "creator"],
    icon: UserCircle2,
  },
  {
    title: "About",
    description: "Learn about Shelby Studio",
    href: "/about",
    keywords: ["information", "studio"],
    icon: Info,
  },
];

export default function Topbar() {
  const router = useRouter();

  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] =
    useState<string | null>(null);

  /*
   * Load the same wallet-specific avatar
   * used by the Shelby Studio profile.
   */
  const loadProfileAvatar = useCallback(() => {
    if (!walletConnected || !walletAddress) {
      setProfileAvatar(null);
      return;
    }

    try {
      const avatarKey =
        `shelby-profile-avatar-${walletAddress.toLowerCase()}`;

      const savedAvatar =
        localStorage.getItem(avatarKey);

      setProfileAvatar(savedAvatar);
    } catch (error) {
      console.error(
        "Failed to load Topbar profile avatar:",
        error
      );

      setProfileAvatar(null);
    }
  }, [walletConnected, walletAddress]);

  /*
   * Reload when wallet changes.
   */
  useEffect(() => {
    loadProfileAvatar();
  }, [loadProfileAvatar]);

  /*
   * Reload immediately when the
   * Shelby Studio profile changes.
   */
  useEffect(() => {
    function handleProfileUpdate() {
      loadProfileAvatar();
    }

    window.addEventListener(
      "shelby-profile-updated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "shelby-profile-updated",
        handleProfileUpdate
      );
    };
  }, [loadProfileAvatar]);

  const results = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return searchablePages.filter((page) => {
      const searchableText = [
        page.title,
        page.description,
        ...page.keywords,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        normalizedQuery
      );
    });
  }, [query]);

  function navigateTo(href: string) {
    setQuery("");
    setSearchOpen(false);
    router.push(href);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (results.length > 0) {
      navigateTo(results[0].href);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="flex min-h-20 items-center gap-3 px-3 py-3 sm:px-6 lg:px-8">

        {/* Shelby Studio Brand */}
        <Link
          href="/dashboard"
          className="hidden shrink-0 items-center gap-3 md:flex"
          aria-label="Shelby Studio Dashboard"
        >
          <Image
            src="/branding/shelby-studio-logo.png"
            alt="Shelby Studio"
            width={40}
            height={40}
            priority
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div className="hidden lg:block">
            <p className="text-sm font-bold tracking-tight text-white">
              Shelby Studio
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-500">
              Digital Asset Workspace
            </p>
          </div>
        </Link>

        {/* Mobile Menu */}
        <details className="relative shrink-0 md:hidden">
          <summary
            className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-white"
            aria-label="Open navigation"
          >
            <span className="text-lg">☰</span>
          </summary>

          <div className="absolute left-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-2xl">
            <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Workspace
            </p>

            <div className="space-y-1">
              <Link href="/dashboard" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Dashboard
              </Link>
              <Link href="/assets" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Assets
              </Link>
              <Link href="/collections" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Collections
              </Link>
              <Link href="/storage" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Storage
              </Link>
              <Link href="/metadata" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Metadata
              </Link>
              <Link href="/explorer" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Explorer
              </Link>
            </div>

            <div className="my-3 border-t border-slate-800" />

            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Developer
            </p>

            <div className="space-y-1">
              <Link href="/developer" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Developer
              </Link>
              <Link href="/ai" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                AI Tools
              </Link>
              <Link href="/docs" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                Documentation
              </Link>
              <Link href="/profile" className="block rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white">
                My Profile
              </Link>
            </div>
          </div>
        </details>

        {/* Global Search */}
        <div className="relative min-w-0 flex-1 lg:max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="relative"
          >
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 sm:left-4"
            />

            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Search Shelby Studio..."
              autoComplete="off"
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-10 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-3 sm:pl-11 sm:pr-11"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </form>

          {/* Search Results */}
          {searchOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
              {results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto p-2">
                  {results.map((result) => {
                    const Icon = result.icon;

                    return (
                      <button
                        key={result.href}
                        type="button"
                        onClick={() =>
                          navigateTo(result.href)
                        }
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-slate-900"
                      >
                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                          <Icon size={19} />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-100">
                            {result.title}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {result.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search
                    size={24}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 font-medium text-slate-300">
                    No results found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try searching for storage,
                    metadata or collections.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex shrink-0 items-center gap-2 sm:ml-4 sm:gap-3 lg:ml-8 lg:gap-4">
          <div className="max-w-[150px] sm:max-w-none"><ConnectWallet /></div>

          <Link
            href="/profile"
            title="Profile"
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-blue-500 hover:bg-slate-800 sm:h-12 sm:w-12"
          >
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2
                size={28}
                className="text-slate-300"
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
