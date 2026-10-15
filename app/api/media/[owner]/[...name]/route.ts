import {
  MediaLookupError,
  createServerShelbyClient,
  resolveMedia,
} from "@/lib/media/server";

import { getFileName } from "@/lib/media/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    owner: string;
    name: string[];
  }>;
};

type ByteRange = {
  start: number;
  /** Inclusive end byte. */
  end: number;
};

/**
 * Parses a single-range `Range: bytes=...` header.
 *
 * Returns:
 *  - a ByteRange when the header is valid and satisfiable
 *  - "unsatisfiable" when it is valid but outside the file (HTTP 416)
 *  - null when there is no usable Range header (serve the whole file)
 */
function parseRange(
  header: string | null,
  size: number
): ByteRange | "unsatisfiable" | null {
  if (!header) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());

  // Multi-range or malformed headers: ignore and serve the whole file.
  if (!match) return null;

  const [, startText, endText] = match;

  if (startText === "" && endText === "") return null;

  if (size <= 0) return "unsatisfiable";

  // Suffix range: the last N bytes.
  if (startText === "") {
    const suffixLength = Number.parseInt(endText, 10);

    if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
      return "unsatisfiable";
    }

    return {
      start: Math.max(size - suffixLength, 0),
      end: size - 1,
    };
  }

  const start = Number.parseInt(startText, 10);

  const requestedEnd =
    endText === "" ? size - 1 : Number.parseInt(endText, 10);

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(requestedEnd) ||
    start >= size ||
    start > requestedEnd
  ) {
    return "unsatisfiable";
  }

  return {
    start,
    end: Math.min(requestedEnd, size - 1),
  };
}

function errorResponse(message: string, status: number, extra?: HeadersInit) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

async function serve(
  request: Request,
  context: RouteContext,
  includeBody: boolean
): Promise<Response> {
  try {
    const { owner, name } = await context.params;

    const client = createServerShelbyClient();

    const media = await resolveMedia(owner, name.join("/"), client);

    const entityTag = `"${media.etag}"`;

    const fileName = getFileName(media.blobName);

    const baseHeaders: Record<string, string> = {
      "Content-Type": media.media.mime,
      "Accept-Ranges": "bytes",
      ETag: entityTag,
      "Cache-Control":
        "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
        fileName
      )}`,
      // Hardening: this origin must never be able to run hosted content.
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Access-Control-Allow-Origin": "*",
    };

    const ifNoneMatch = request.headers.get("if-none-match");

    if (
      ifNoneMatch &&
      ifNoneMatch.split(",").some((tag) => tag.trim() === entityTag)
    ) {
      return new Response(null, { status: 304, headers: baseHeaders });
    }

    const range = parseRange(request.headers.get("range"), media.size);

    if (range === "unsatisfiable") {
      return errorResponse("Requested range not satisfiable.", 416, {
        "Content-Range": `bytes */${media.size}`,
      });
    }

    // HEAD: headers only, no download from Shelby.
    if (!includeBody) {
      const length = range ? range.end - range.start + 1 : media.size;

      return new Response(null, {
        status: range ? 206 : 200,
        headers: {
          ...baseHeaders,
          "Content-Length": String(length),
          ...(range
            ? {
                "Content-Range": `bytes ${range.start}-${range.end}/${media.size}`,
              }
            : {}),
        },
      });
    }

    const blob = await client.download({
      account: media.owner,
      blobName: media.blobName,
      ...(range ? { range: { start: range.start, end: range.end } } : {}),
    });

    if (range) {
      const expectedLength = range.end - range.start + 1;

      if (blob.contentLength !== expectedLength) {
        console.error(
          `[media] Range length mismatch for ${media.blobName}: expected ${expectedLength}, got ${blob.contentLength}`
        );

        return errorResponse("Unexpected response from storage.", 502);
      }

      return new Response(blob.readable, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Length": String(expectedLength),
          "Content-Range": `bytes ${range.start}-${range.end}/${media.size}`,
        },
      });
    }

    return new Response(blob.readable, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Length": String(blob.contentLength),
      },
    });
  } catch (error) {
    if (error instanceof MediaLookupError) {
      return errorResponse(error.message, error.status);
    }

    console.error("[media] Streaming failed:", error);

    return errorResponse("Unable to load this media right now.", 502);
  }
}

export async function GET(request: Request, context: RouteContext) {
  return serve(request, context, true);
}

export async function HEAD(request: Request, context: RouteContext) {
  return serve(request, context, false);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, If-None-Match",
      "Access-Control-Expose-Headers":
        "Content-Length, Content-Range, Accept-Ranges, ETag",
      "Access-Control-Max-Age": "86400",
    },
  });
}
