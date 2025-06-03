import { useEffect, useState } from "react";
import { type Address, formatUnits } from "viem";
import { useReadContracts } from "wagmi";
import bitAbi from "./abi-bit.json";
import bnoteAbi from "../BNOTE/abi-bnote.json";

export function useBITInformation({
                                      walletAddress,
                                      bitContractAddress,
                                      bnoteContractAddress,
                                  }: {
    walletAddress?: Address;
    bitContractAddress: Address;
    bnoteContractAddress: Address;
}) {
    const [bitBalance, setBitBalance] = useState<bigint>(BigInt(0));
    const [bnoteBalances, setBnoteBalances] = useState<{
        [key: number]: bigint;
    }>({
        1: BigInt(0),
        10: BigInt(0),
        100: BigInt(0),
    });
    const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);
    const [bitContractBnoteBalances, setBitContractBnoteBalances] = useState<{
        [key: number]: bigint;
    }>({
        1: BigInt(0),
        10: BigInt(0),
        100: BigInt(0),
    });

    const {
        data: contractData,
        isLoading,
        refetch,
    } = useReadContracts({
        contracts: [
            // User's BIT balance
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "balanceOf",
                args: [walletAddress || "0x0"],
            },
            // User's BNOTE balances (1, 10, 100)
            {
                address: bnoteContractAddress,
                abi: bnoteAbi,
                functionName: "balanceOf",
                args: [walletAddress || "0x0", 1],
            },
            {
                address: bnoteContractAddress,
                abi: bnoteAbi,
                functionName: "balanceOf",
                args: [walletAddress || "0x0", 10],
            },
            {
                address: bnoteContractAddress,
                abi: bnoteAbi,
                functionName: "balanceOf",
                args: [walletAddress || "0x0", 100],
            },
            // Check if user approved BIT contract for BNOTE transfers
            {
                address: bnoteContractAddress,
                abi: bnoteAbi,
                functionName: "isApprovedForAll",
                args: [walletAddress || "0x0", bitContractAddress],
            },
            // BIT contract's BNOTE balances (for redemption)
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "getBNoteBalance",
                args: [1],
            },
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "getBNoteBalance",
                args: [10],
            },
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "getBNoteBalance",
                args: [100],
            },
        ],
    });

    useEffect(() => {
        if (contractData) {
            // BIT balance
            if (contractData[0]?.result) {
                setBitBalance(contractData[0].result as bigint);
            }

            // User BNOTE balances
            if (contractData[1]?.result) {
                setBnoteBalances(prev => ({ ...prev, 1: contractData[1].result as bigint }));
            }
            if (contractData[2]?.result) {
                setBnoteBalances(prev => ({ ...prev, 10: contractData[2].result as bigint }));
            }
            if (contractData[3]?.result) {
                setBnoteBalances(prev => ({ ...prev, 100: contractData[3].result as bigint }));
            }

            // Approval status
            if (contractData[4]?.result !== undefined) {
                setIsApprovedForAll(contractData[4].result as boolean);
            }

            // BIT contract BNOTE balances
            if (contractData[5]?.result) {
                setBitContractBnoteBalances(prev => ({ ...prev, 1: contractData[5].result as bigint }));
            }
            if (contractData[6]?.result) {
                setBitContractBnoteBalances(prev => ({ ...prev, 10: contractData[6].result as bigint }));
            }
            if (contractData[7]?.result) {
                setBitContractBnoteBalances(prev => ({ ...prev, 100: contractData[7].result as bigint }));
            }
        }
    }, [contractData]);

    function formatBitAmount(amount: bigint) {
        return parseFloat(formatUnits(amount, 18)).toLocaleString(undefined, {
            maximumFractionDigits: 4,
        });
    }

    const totalUserBnoteValue =
        bnoteBalances[1] * BigInt(1) +
        bnoteBalances[10] * BigInt(10) +
        bnoteBalances[100] * BigInt(100);

    return {
        isLoading,
        bitBalance,
        bnoteBalances,
        isApprovedForAll,
        bitContractBnoteBalances,
        totalUserBnoteValue,
        displayValues: {
            bitBalance: formatBitAmount(bitBalance),
            totalBnoteValue: totalUserBnoteValue.toString(),
        },
        refetch,
    };
}