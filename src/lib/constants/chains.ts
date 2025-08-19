import {mainnet, base, sepolia, baseSepolia} from "wagmi/chains";
import type {ChainId} from "@/lib/constants/contracts.ts";
import {Network} from "alchemy-sdk";

export const PRODUCTION_CHAINS = [mainnet, base] as const;
export const TESTNET_CHAINS = [sepolia, baseSepolia] as const;
export const ALL_CHAINS = [...PRODUCTION_CHAINS, ...TESTNET_CHAINS] as const;

export const CHAIN_TO_ALCHEMY_NETWORK: Record<ChainId, Network> = {
    1: Network.ETH_MAINNET,
    11155111: Network.ETH_SEPOLIA,
    8453: Network.BASE_MAINNET,
    84532: Network.BASE_SEPOLIA,
} as const;

export type SupportedChain = typeof ALL_CHAINS[number];

export function isTestnet(chain: typeof ALL_CHAINS[number]): boolean {
    return (TESTNET_CHAINS).includes(chain as typeof TESTNET_CHAINS[number]);
}
