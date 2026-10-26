import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

import { TIP_FUNCTION } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Submit = (input: any) => Promise<any>;

/** Sends APT from the connected wallet straight to `to` and waits until the network confirms it. Returns the transaction hash. */
export async function payApt(signAndSubmitTransaction: Submit, to: string, octas: number): Promise<string> {
  const result = await signAndSubmitTransaction({
    data: { function: TIP_FUNCTION, functionArguments: [to, octas] },
  });

  const hash: string | undefined = result?.hash;

  if (!hash) throw new Error("Your wallet did not return a transaction.");

  await new Aptos(new AptosConfig({ network: Network.SHELBYNET })).waitForTransaction({ transactionHash: hash });

  return hash;
}
