export const COMMENT_MAX = 500;

export interface Comment {
  id: string;
  author: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export const commentScope = (owner: string, target: string) => `${owner.toLowerCase()}|${target}`;

/** One cleaning rule for the browser (before signing) and the server (before saving). */
export function cleanComment(input: unknown): { ok: true; body: string } | { ok: false; error: string } {
  if (typeof input !== "string") return { ok: false, error: "Write a comment first." };

  const body = input.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (!body) return { ok: false, error: "Write a comment first." };

  if (body.length > COMMENT_MAX) return { ok: false, error: `Comments can be up to ${COMMENT_MAX} characters.` };

  if (/[\u0000-\u0008\u000b-\u001f\u007f]/.test(body)) return { ok: false, error: "That comment has unsupported characters." };

  return { ok: true, body };
}
