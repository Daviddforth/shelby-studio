"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import SearchBar from "@/components/explorer/SearchBar";
import AssetTable from "@/components/explorer/AssetTable";

import { useWallet } from "@/context/WalletContext";

export default function ExplorerPage() {
  const {
    walletConnected,
    walletAddress,
  } = useWallet();

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("newest");

  const [accountAddress, setAccountAddress] =
    useState("");

  const [activeAddress, setActiveAddress] =
    useState("");

  useEffect(() => {
    if (
      walletConnected &&
      walletAddress &&
      !activeAddress
    ) {
      setAccountAddress(walletAddress);
      setActiveAddress(walletAddress);
    }
  }, [
    walletConnected,
    walletAddress,
    activeAddress,
  ]);

  function handleExplore() {
    const address =
      accountAddress.trim();

    if (!address) {
      return;
    }

    setActiveAddress(address);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ExplorerHeader />

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
              Public Explorer
            </p>

            <h2 className="mt-2 text-xl font-bold text-white">
              Explore Shelby storage
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Enter a Shelby account address to view
              its publicly discoverable stored blobs.
              No wallet connection is required.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type="text"
                value={accountAddress}
                onChange={(event) =>
                  setAccountAddress(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleExplore();
                  }
                }}
                placeholder="Enter Shelby account address (0x...)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-4 font-mono text-sm text-white outline-none transition placeholder:font-sans placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleExplore}
              disabled={!accountAddress.trim()}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Explore Account
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>
              Public read-only access
            </span>

            <span className="text-slate-700">
              •
            </span>

            <span>
              Shelbynet
            </span>

            {walletConnected &&
              walletAddress && (
                <>
                  <span className="text-slate-700">
                    •
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountAddress(
                        walletAddress
                      );
                      setActiveAddress(
                        walletAddress
                      );
                    }}
                    className="text-blue-400 transition hover:text-blue-300"
                  >
                    Explore connected wallet
                  </button>
                </>
              )}
          </div>
        </section>

        {activeAddress ? (
          <div className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
              <SearchBar />

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="all">
                  All Status
                </option>

                <option value="Stored">
                  Stored
                </option>

                <option value="Failed">
                  Failed
                </option>

                <option value="Pending">
                  Pending
                </option>
              </select>

              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value)
                }
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="oldest">
                  Oldest
                </option>

                <option value="name">
                  Name
                </option>

                <option value="largest">
                  Largest
                </option>

                <option value="smallest">
                  Smallest
                </option>
              </select>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-slate-600">
                Exploring account
              </p>

              <p className="mt-1 break-all font-mono text-xs text-slate-400">
                {activeAddress}
              </p>
            </div>

            <AssetTable
              status={status}
              sort={sort}
              ownerAddress={activeAddress}
            />
          </div>
        ) : (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-8">
            <div className="max-w-lg text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Search size={26} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Search a Shelby account
              </h2>

              <p className="mt-3 leading-7 text-slate-400">
                Enter an account address above to
                discover its stored blobs on
                Shelbynet.
              </p>

              <div className="mt-5 inline-flex items-center rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
                No wallet required
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
