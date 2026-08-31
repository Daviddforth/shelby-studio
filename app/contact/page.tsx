"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  GitBranch,
  ExternalLink,
  Send,
} from "lucide-react";
import { FormEvent, useState } from "react";

const SUPPORT_EMAIL = "support@shelbystudio.xyz";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function openEmail(subjectText: string, bodyText: string) {
    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(SUPPORT_EMAIL)}` +
      `&su=${encodeURIComponent(subjectText)}` +
      `&body=${encodeURIComponent(bodyText)}`;

    const mailtoUrl =
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(subjectText)}` +
      `&body=${encodeURIComponent(bodyText)}`;

    const popup = window.open(
      gmailUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (!popup) {
      window.location.href = mailtoUrl;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = [
      `Hello Shelby Studio Team,`,
      ``,
      `Name: ${name || "Not provided"}`,
      `Email: ${email || "Not provided"}`,
      ``,
      message,
      ``,
      `Regards,`,
      name || "Shelby Studio user",
    ].join("\n");

    openEmail(
      subject || "Message from Shelby Studio",
      body
    );
  }

  function handleSupportEmail() {
    openEmail(
      "Shelby Studio Support",
      "Hello Shelby Studio Team,\n\nI would like to get in touch regarding Shelby Studio.\n\nThank you."
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Shelby Studio
        </Link>

        <div className="mt-12 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Contact
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Let&apos;s talk.
          </h1>

          <p className="mt-6 text-base leading-8 text-slate-400 sm:text-lg">
            Have a question, found a bug, want to collaborate, or
            building something with Shelby Studio? Get in touch.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Contact form */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Send us a message
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Tell us what you&apos;re working on or how we can help.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-300"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="Your name"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="text-sm font-medium text-slate-300"
                >
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value)
                  }
                  placeholder="What can we help with?"
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-slate-300"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Tell us how we can help..."
                  rows={8}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
                >
                  <Send size={16} />
                  Send Message
                </button>

                <p className="mt-3 text-xs leading-5 text-slate-600">
                  This will open Gmail with your message already
                  prepared and addressed to Shelby Studio support.
                </p>
              </div>
            </form>
          </section>

          {/* Contact options */}
          <aside className="space-y-4">
            <button
              type="button"
              onClick={handleSupportEmail}
              className="group w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left transition hover:border-blue-500/40 hover:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Mail size={20} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Email Support
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Reach the Shelby Studio team directly.
              </p>

              <p className="mt-4 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                {SUPPORT_EMAIL}
              </p>
            </button>

            <a
              href="https://x.com/ShelbyStudioHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-blue-500/40 hover:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <MessageCircle size={20} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                Follow on X
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Follow Shelby Studio and connect with the project.
              </p>

              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                @ShelbyStudioHQ
                <ExternalLink size={14} />
              </p>
            </a>

            <a
              href="https://github.com/Daviddforth/shelby-studio"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-blue-500/40 hover:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <GitBranch size={20} />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-white">
                GitHub
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Explore the project and follow development.
              </p>

              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                View repository
                <ExternalLink size={14} />
              </p>
            </a>
          </aside>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <p className="text-sm leading-6 text-slate-500">
            Shelby Studio is built for developers, creators, game
            builders and Web3 teams building with Shelby.
          </p>
        </div>
      </div>
    </main>
  );
}
