import { signWalletMessage } from "@/lib/media/clientSign";
import { sha256Hex } from "@/lib/media/types";

import {
  buildProfileMessage,
  canonicalProfile,
  type ProfileData,
  type SaveProfileRequest,
} from "./types";

/** Signs "save this exact profile" with the connected wallet. Free; nothing goes on-chain. */
export async function signProfileRequest({
  signMessage,
  account,
  owner,
  profile,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signMessage: (input: any) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
  owner: string;
  profile: ProfileData;
}): Promise<SaveProfileRequest> {
  const issuedAt = new Date().toISOString();

  const hash = await sha256Hex(canonicalProfile(owner, profile));

  const proof = await signWalletMessage({
    signMessage,
    account,
    message: buildProfileMessage(hash, issuedAt),
  });

  return { ...profile, owner, issuedAt, ...proof };
}
