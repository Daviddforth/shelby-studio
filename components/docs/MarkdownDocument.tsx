import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export default function MarkdownDocument({
  content,
}: Props) {
  return (
    <div className="docs-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-4 mt-12 border-b border-slate-800 pb-3 text-2xl font-bold text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-xl font-semibold text-slate-100">
              {children}
            </h3>
          ),

          p: ({ children }) => (
            <p className="my-4 leading-7 text-slate-300">
              {children}
            </p>
          ),

          ul: ({ children }) => (
            <ul className="my-5 list-disc space-y-2 pl-6 text-slate-300">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-5 list-decimal space-y-2 pl-6 text-slate-300">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-7">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-6 rounded-r-xl border-l-4 border-blue-500 bg-blue-500/5 px-5 py-3 text-slate-300">
              {children}
            </blockquote>
          ),

          code: ({ children }) => (
            <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-sm text-blue-300">
              {children}
            </code>
          ),

          pre: ({ children }) => (
            <pre className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-300">
              {children}
            </pre>
          ),

          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-400 underline underline-offset-4 transition hover:text-blue-300"
            >
              {children}
            </a>
          ),

          hr: () => (
            <hr className="my-10 border-slate-800" />
          ),

          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-slate-900">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="border-b border-slate-700 px-4 py-3 text-left font-semibold text-white">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-t border-slate-800 px-4 py-3 text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
