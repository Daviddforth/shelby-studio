import { after } from "next/server";

import { fail, handleError, json, readSigned } from "@/lib/apiServer";
import { normalizeOwner } from "@/lib/live/server";
import { notifyFollowers } from "@/lib/notify/server";
import { upcomingFor } from "@/lib/schedule/db";
import {
  SCHEDULE_ID_RE,
  SCHEDULE_PER_CREATOR,
  cleanSchedule,
  scheduleFields,
} from "@/lib/schedule/types";
import { docs } from "@/lib/store/docs";

export const runtime = "nodejs";

/** Public: a creator's upcoming lives. */
export async function GET(request: Request) {
  const owner = normalizeOwner(new URL(request.url).searchParams.get("owner"));

  if (!owner) return fail("Invalid owner.", 400);

  return json({ success: true, lives: await upcomingFor(owner) });
}

/** Wallet-signed: schedule a live. Followers get an alert. */
export async function POST(request: Request) {
  let cleaned: ReturnType<typeof cleanSchedule> | null = null;

  const signed = await readSigned(request, "schedule", 10, "schedule-live", (body) => {
    if (typeof body.id !== "string" || !SCHEDULE_ID_RE.test(body.id)) return "Invalid id.";

    cleaned = cleanSchedule(body);

    return cleaned.ok ? scheduleFields(body.id, cleaned.title, cleaned.startsAt) : cleaned.error;
  });

  if (signed instanceof Response) return signed;

  const result = cleaned as ReturnType<typeof cleanSchedule> | null;

  if (!result || !result.ok) return fail("Invalid schedule.", 400);

  const id = signed.body.id as string;

  try {
    const current = await upcomingFor(signed.owner);

    if (!current.some((live) => live.id === id) && current.length >= SCHEDULE_PER_CREATOR) {
      return fail(`You can have up to ${SCHEDULE_PER_CREATOR} upcoming lives.`, 400);
    }

    const isNew = !current.some((live) => live.id === id);

    await docs.put("schedule", signed.owner, id, { title: result.title, startsAt: result.startsAt });

    if (isNew) {
      after(async () => {
        await notifyFollowers(
          signed.owner,
          "schedule",
          (name) => ({
            title: `${name} scheduled a live`,
            body: `${result.title} · ${new Date(result.startsAt).toUTCString().replace(" GMT", " UTC")}`,
            url: `/c/${signed.owner}`,
          }),
          60_000
        ).catch((error) => console.error("[notify] failed", error));
      });
    }

    return json({ success: true, id });
  } catch (error) {
    return handleError("schedule", error);
  }
}

/** Wallet-signed: cancel a scheduled live. */
export async function DELETE(request: Request) {
  const signed = await readSigned(request, "schedule-del", 20, "cancel-live", (body) =>
    typeof body.id === "string" && SCHEDULE_ID_RE.test(body.id) ? [body.id] : "Invalid id."
  );

  if (signed instanceof Response) return signed;

  try {
    await docs.del("schedule", signed.owner, signed.body.id as string);

    return json({ success: true });
  } catch (error) {
    return handleError("schedule", error);
  }
}
