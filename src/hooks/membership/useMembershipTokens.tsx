import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { getContractAddress } from '@/lib/constants/contracts';
import { useAlchemyNFTs } from '@/hooks/alchemy/useAlchemyNFTs';
import membershipAbi from '@/lib/constants/membership.abi.json';
import { createPublicClient, http, type Abi } from 'viem';

/**
 * Hook to get membership tokens - always uses mainnet regardless of connected chain
 */
export function useMembershipTokensWithExpiration(ownerAddress: string | undefined) {
    const membershipAddress = getContractAddress('membership', mainnet.id);

    // Always use mainnet for membership, regardless of connected chain
    const {
        data: ownedNfts = [],
        isLoading: nftsLoading,
        error: nftsError
    } = useAlchemyNFTs(ownerAddress, [membershipAddress], mainnet.id);

    const tokenIds = ownedNfts.map(nft => nft.tokenId);

    // Check expiration status for the owned tokens
    const expiration = useQuery({
        queryKey: ['membership', 'expiration', ownerAddress, tokenIds],
        queryFn: async (): Promise<Array<{ tokenId: string; isExpired: boolean }>> => {
            if (!tokenIds.length) return [];

            const mainnetClient = createPublicClient({
                chain: mainnet,
                transport: http(),
            });

            // Batch check expiration for all tokens
            const expirationResults = await mainnetClient.multicall({
                contracts: tokenIds.map(tokenId => ({
                    address: membershipAddress,
                    abi: membershipAbi as Abi,
                    functionName: 'isExpired',
                    args: [tokenId],
                })),
            });

            return tokenIds.map((tokenId, index) => ({
                tokenId,
                isExpired: expirationResults[index]?.result === true,
            }));
        },
        enabled: Boolean(ownerAddress && tokenIds.length > 0),
    });

    return {
        data: expiration.data || [],
        isLoading: nftsLoading || expiration.isLoading,
        error: nftsError || expiration.error,
    };
}