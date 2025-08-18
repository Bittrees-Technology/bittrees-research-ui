import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useCookies } from 'react-cookie';
import { mainnet } from 'wagmi/chains';
import { getContractAddress } from '@/lib/constants/contracts';
import { useMembershipTokensWithExpiration } from './useMembershipTokens';

interface MembershipValidationResult {
    hasValidMembership: boolean;
    isLoading: boolean;
    error: Error | null;
    isConnected: boolean;
    address: string | undefined;
}

export function useMembershipValidation(): MembershipValidationResult {
    const { address, isConnected } = useAccount();

    // Always use mainnet for membership validation
    const membershipContractAddress = getContractAddress('membership', mainnet.id);
    const [cookies, setCookie] = useCookies([membershipContractAddress]);

    // Check if we have a cached membership token
    const cachedToken = cookies[membershipContractAddress];
    const hasCachedMembership = Boolean(cachedToken);

    // Get membership tokens with expiration data
    const {
        data: membershipTokens = [],
        isLoading: tokensLoading,
        error: tokensError
    } = useMembershipTokensWithExpiration(address);

    const {
        data: hasValidMembership = false,
        isLoading: validationLoading,
        error: validationError,
    } = useQuery({
        queryKey: ['membership', 'validation', address, isConnected, membershipTokens],
        queryFn: async (): Promise<boolean> => {
            // If we have a cached token, assume valid membership
            if (hasCachedMembership) {
                return true;
            }

            // No wallet connected
            if (!address || !isConnected) {
                return false;
            }

            // No tokens found
            if (!membershipTokens.length) {
                return false;
            }

            // Check if any token is NOT expired
            const hasActiveMembership = membershipTokens.some(token => !token.isExpired);

            // Cache the result if membership is valid
            if (hasActiveMembership) {
                setCookie(membershipContractAddress, address, {
                    path: '/',
                    maxAge: 60 * 60 * 24, // 24 hours
                });
            }

            return hasActiveMembership;
        },
        enabled: isConnected && !tokensLoading, // Wait for tokens to load
    });

    const isLoading = (tokensLoading || validationLoading) && isConnected;
    const error = tokensError || validationError;

    return {
        hasValidMembership,
        isLoading,
        error: error as Error | null,
        isConnected,
        address,
    };
}