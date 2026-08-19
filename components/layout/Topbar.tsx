"use client";

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
      <div className="flex h-20 items-center justify-between px-8">

        {/* Global Search */}
        <div className="relative w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="relative"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
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
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-11 pr-11 text-slate-200 outline-none transition-all placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
        <div className="ml-8 flex items-center gap-4">
          <ConnectWallet />

          <Link
            href="/profile"
            title="Profile"
            className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-blue-500 hover:bg-slate-800"
          >
            {profileAvatar ? (
              <img
                src={profileAvatar}
                alt="Profile avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle2
                size={34}
                className="text-slate-300"
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
