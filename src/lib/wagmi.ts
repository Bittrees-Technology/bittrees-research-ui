import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ALL_CHAINS } from "@/lib/constants/chains.ts";

/**
 * Shared wallet/RPC config for Bittrees Research. Exported as a module singleton
 * so the messenger (and @wagmi/core calls inside it) use the same config the
 * providers are built from.
 */

const FALLBACK_PROJECT_ID = "8971e0de563ab27ccfff96c91ac1c3c3";

const rawProjectId = (import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string | undefined)?.trim();
const projectId = rawProjectId || FALLBACK_PROJECT_ID;

// Optional dedicated mainnet RPC; falls back to the public default transport.
const mainnetRpc = import.meta.env.VITE_MAINNET_RPC_URL as string | undefined;
const httpConfig = { batch: true } as const;

// WalletConnect metadata.url must match the page ORIGIN, not the current route,
// or it trips the "configured metadata.url differs" warning and weakens domain
// verification. Use the live origin (correct on prod, previews, and local dev).
const appOrigin =
  typeof window !== "undefined" ? window.location.origin : "https://research.bittrees.org";

export const wagmiConfig = getDefaultConfig({
  appName: "Bittrees Research",
  appDescription: "Bittrees Research — a members-only research foundation.",
  appUrl: appOrigin,
  appIcon: `${appOrigin}/bittrees_logo_tree.png`,
  projectId,
  chains: ALL_CHAINS,
  transports: Object.fromEntries(
    ALL_CHAINS.map((c) => [
      c.id,
      c.id === 1 && mainnetRpc ? http(mainnetRpc, httpConfig) : http(undefined, httpConfig),
    ])
  ),
  ssr: false,
});
