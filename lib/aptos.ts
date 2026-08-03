import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const aptos = new Aptos(
  new AptosConfig({
    network: Network.TESTNET,
  })
);