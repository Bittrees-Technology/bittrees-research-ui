import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { mainnet } from "wagmi/chains";
import { createPublicClient, http, type Abi } from "viem";
import { getContractAddress } from "@/lib/constants/contracts";
import { useAlchemyNFTs } from "@/hooks/alchemy/useAlchemyNFTs";
import membershipAbi from "@/lib/constants/membership.abi.json";

export interface MembershipToken {
  tokenId: string;
  expiresAt: number; // unix seconds
  isExpired: boolean;
}

export interface MembershipStatus {
  isConnected: boolean;
  address?: string;
  isLoading: boolean;
  tokens: MembershipToken[];
  hasValidMembership: boolean;
  /** Furthest-out active expiry — the member's effective access end. */
  activeExpiresAt?: number;
  /** Whole days until access ends (0 if expired/none). */
  daysLeft?: number;
  /** True once a valid membership is within the renewal window. */
  expiringSoon: boolean;
  error: Error | null;
  refetch: () => void;
}

/** Renew prompt fires inside this many days of expiry. */
export const RENEWAL_WINDOW_DAYS = 30;

/**
 * Full membership picture for the connected wallet. Always reads mainnet
 * (where the membership ERC-1155 lives) regardless of the connected chain.
 * Discovery via Alchemy; expiry + status via on-chain multicall (source of truth).
 */
export function useMembershipStatus(): MembershipStatus {
  const { address, isConnected } = useAccount();
  const membershipAddress = getContractAddress("membership", mainnet.id);

  const {
    data: ownedNfts = [],
    isLoading: nftsLoading,
    error: nftsError,
    refetch: refetchNfts,
  } = useAlchemyNFTs(address, [membershipAddress], mainnet.id);

  const tokenIds = ownedNfts.map((nft) => nft.tokenId);
  const statusCacheKey = address ? `br_membership_${address.toLowerCase()}` : undefined;

  const statusQuery = useQuery({
    queryKey: ["membership", "status", address, tokenIds],
    queryFn: async (): Promise<MembershipToken[]> => {
      if (!tokenIds.length) return [];
      const client = createPublicClient({ chain: mainnet, transport: http() });
      const [expiredResults, stampResults] = await Promise.all([
        client.multicall({
          contracts: tokenIds.map((tokenId) => ({
            address: membershipAddress,
            abi: membershipAbi as Abi,
            functionName: "isExpired",
            args: [tokenId],
          })),
        }),
        client.multicall({
          contracts: tokenIds.map((tokenId) => ({
            address: membershipAddress,
            abi: membershipAbi as Abi,
            functionName: "expirationTimestamps",
            args: [tokenId],
          })),
        }),
      ]);
      const result = tokenIds.map((tokenId, i) => ({
        tokenId,
        isExpired: expiredResults[i]?.result === true,
        expiresAt: Number(stampResults[i]?.result ?? 0n),
      }));
      try { if (statusCacheKey) localStorage.setItem(statusCacheKey, JSON.stringify(result)); } catch { /* quota */ }
      return result;
    },
    enabled: Boolean(address && tokenIds.length > 0),
    staleTime: 5 * 60_000,
    // Paint from the last cached status instantly on reload; revalidate in bg.
    initialData: statusCacheKey
      ? (): MembershipToken[] | undefined => {
          try { const c = JSON.parse(localStorage.getItem(statusCacheKey) || "null"); return Array.isArray(c) ? c : undefined; }
          catch { return undefined; }
        }
      : undefined,
    initialDataUpdatedAt: 0,
  });

  const tokens = statusQuery.data ?? [];
  const active = tokens.filter((t) => !t.isExpired);
  const hasValidMembership = active.length > 0;
  const activeExpiresAt = active.length
    ? Math.max(...active.map((t) => t.expiresAt))
    : undefined;
  const nowSec = Math.floor(Date.now() / 1000);
  const daysLeft = activeExpiresAt
    ? Math.max(0, Math.ceil((activeExpiresAt - nowSec) / 86400))
    : undefined;
  const expiringSoon =
    hasValidMembership && daysLeft !== undefined && daysLeft <= RENEWAL_WINDOW_DAYS;

  return {
    isConnected,
    address,
    isLoading: (nftsLoading || statusQuery.isLoading) && isConnected,
    tokens,
    hasValidMembership,
    activeExpiresAt,
    daysLeft,
    expiringSoon,
    error: (nftsError || statusQuery.error) as Error | null,
    refetch: () => {
      refetchNfts();
      statusQuery.refetch();
    },
  };
}
