/**
 * Public creator profile (safe to import from server and client code).
 *
 * The same cleaning rules run in the browser (before signing) and on the
 * server (before saving), so what the wallet signs is exactly what is stored.
 */

export const NAME_MAX = 40;

export const BIO_MAX = 280;

export const WEBSITE_MAX = 200;

export interface ProfileData {
  displayName: string;
  bio: string;
  website: string;
  /** X (Twitter) handle without the @. Not verified. */
  twitter: string;
  github: string;
  /** An image in the creator's own Shelby storage, shown as the profile picture. */
  avatarBlob: string | null;
}

export const EMPTY_PROFILE: ProfileData = {
  displayName: "",
  bio: "",
  website: "",
  twitter: "",
  github: "",
  avatarBlob: null,
};

function singleLine(value: unknown, max: number): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function multiLine(value: unknown, max: number): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export type ProfileResult =
  | { ok: true; profile: ProfileData }
  | { ok: false; error: string };

/** Cleans and validates profile input. Never throws. */
export function sanitizeProfile(input: Partial<Record<keyof ProfileData, unknown>>): ProfileResult {
  const displayName = singleLine(input.displayName, NAME_MAX);

  const bio = multiLine(input.bio, BIO_MAX);

  const twitter = singleLine(input.twitter, 40).replace(/^@/, "");

  if (twitter && !/^[A-Za-z0-9_]{1,15}$/.test(twitter)) {
    return { ok: false, error: "X handle can only have letters, numbers and _ (up to 15)." };
  }

  const github = singleLine(input.github, 60).replace(/^@/, "");

  if (github && !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(github)) {
    return { ok: false, error: "GitHub username is not valid." };
  }

  let website = singleLine(input.website, WEBSITE_MAX + 50);

  if (website) {
    if (!/^[a-z][a-z0-9+.-]*:/i.test(website)) website = `https://${website}`;

    try {
      const url = new URL(website);

      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("scheme");

      website = url.toString();
    } catch {
      return { ok: false, error: "Website must be a normal web address, like https://example.com." };
    }

    if (website.length > WEBSITE_MAX) {
      return { ok: false, error: `Website must be ${WEBSITE_MAX} characters or fewer.` };
    }
  }

  const avatarBlob =
    typeof input.avatarBlob === "string" && input.avatarBlob.trim()
      ? input.avatarBlob.trim().slice(0, 1024)
      : null;

  return {
    ok: true,
    profile: { displayName, bio, website, twitter, github, avatarBlob },
  };
}

/** The text that is hashed and bound into the signed message. */
export function canonicalProfile(owner: string, profile: ProfileData): string {
  return JSON.stringify({
    owner: owner.toLowerCase(),
    displayName: profile.displayName,
    bio: profile.bio,
    website: profile.website,
    twitter: profile.twitter,
    github: profile.github,
    avatarBlob: profile.avatarBlob,
  });
}

/** One-line text a wallet signs to authorize saving a profile. */
export function buildProfileMessage(payloadHash: string, issuedAt: string): string {
  return `Shelby Studio: update my creator profile | ref ${payloadHash.slice(0, 32)} | ${issuedAt}`;
}

/** Body sent to PUT /api/profile. */
export interface SaveProfileRequest extends ProfileData {
  owner: string;
  issuedAt: string;
  publicKey: string;
  /** Base64 signature bytes. */
  signature: string;
  fullMessage: string;
}

/** Name shown on pages: the display name, or a shortened address. */
export function profileLabel(profile: Pick<ProfileData, "displayName"> | null, owner: string): string {
  const name = profile?.displayName?.trim();

  if (name) return name;

  return owner.length > 14 ? `${owner.slice(0, 8)}…${owner.slice(-6)}` : owner;
}
