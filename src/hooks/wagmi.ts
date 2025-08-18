// hooks/wagmi.ts - Custom wagmi hook overrides
import { useChains as useWagmiChains } from "wagmi";
import { useTestnetState } from "./useTestnetState";
import { useMemo } from "react";

// Custom hook that filters wagmi's chains
export function useChains() {
    const { isEnabled } = useTestnetState();
    const allChains = useWagmiChains();

    return useMemo(() => {
        if (isEnabled) {
            return allChains; // Show all chains when testnets enabled
        }

        // Filter out testnet chains when testnets disabled
        return allChains.filter(chain => !chain.testnet);
    }, [allChains, isEnabled]);
}

// Re-export other wagmi hooks normally (optional, for consistency)
export {
    useAccount,
    useBalance,
    useChainId,
    useSwitchChain,
    // ... other wagmi hooks you use
} from "wagmi";