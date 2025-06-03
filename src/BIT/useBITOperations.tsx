import { useEffect, useState } from "react";
import { type Address } from "viem";
import {
    useSimulateContract,
    useWaitForTransactionReceipt,
    useWriteContract,
    useReadContracts,
} from "wagmi";
import bitAbi from "./abi-bit.json";
import bnoteAbi from "../BNOTE/abi-bnote.json";

// Hook for managing BNOTE approval for BIT contract
export function useBNoteApproval({
                                     bnoteContractAddress,
                                     bitContractAddress,
                                     chainId,
                                 }: {
    bnoteContractAddress: Address;
    bitContractAddress: Address;
    chainId: number;
}) {
    const [approvalHash, setApprovalHash] = useState<Address | undefined>();

    const { data: simulateData } = useSimulateContract({
        address: bnoteContractAddress,
        abi: bnoteAbi,
        functionName: "setApprovalForAll",
        chainId,
        args: [bitContractAddress, true],
    });

    const { writeContract, data: writeData } = useWriteContract();

    useEffect(() => {
        if (writeData) {
            setApprovalHash(writeData);
        }
    }, [writeData]);

    const { data: approvalTransactionResult } = useWaitForTransactionReceipt(
        approvalHash
            ? {
                hash: approvalHash,
                chainId,
                confirmations: 5,
            }
            : undefined
    );

    function sendApproval() {
        if (!simulateData?.request) return;
        writeContract(simulateData.request);
    }

    return {
        sendApproval,
        approvalTransactionResult,
    };
}

// Hook for minting BIT tokens
export function useBITMint({
                               bitContractAddress,
                               bnoteIds,
                               bnoteAmounts,
                           }: {
    bitContractAddress: Address;
    bnoteIds: bigint[];
    bnoteAmounts: bigint[];
}) {
    const { data: simulateData, error: simulateError } = useSimulateContract({
        address: bitContractAddress,
        abi: bitAbi,
        functionName: "mint",
        args: [bnoteIds, bnoteAmounts],
        query: {
            enabled: bnoteIds.length > 0 && bnoteAmounts.length > 0,
        },
    });

    const {
        writeContract: mintRaw,
        data: txData,
        isSuccess: isSuccessfulMint,
        isPending,
    } = useWriteContract();

    const mintBIT = () => {
        if (!simulateData?.request) return;
        mintRaw(simulateData.request);
    };

    return {
        mintBIT,
        isSuccessfulMint,
        txData,
        isPending,
        simulateError,
    };
}

// Hook for redeeming BIT tokens
export function useBITRedeem({
                                 bitContractAddress,
                                 bnoteIds,
                                 bnoteAmounts,
                             }: {
    bitContractAddress: Address;
    bnoteIds: bigint[];
    bnoteAmounts: bigint[];
}) {
    const { data: simulateData, error: simulateError } = useSimulateContract({
        address: bitContractAddress,
        abi: bitAbi,
        functionName: "redeem",
        args: [bnoteIds, bnoteAmounts],
        query: {
            enabled: bnoteIds.length > 0 && bnoteAmounts.length > 0,
        },
    });

    const {
        writeContract: redeemRaw,
        data: txData,
        isSuccess: isSuccessfulRedeem,
        isPending,
    } = useWriteContract();

    const redeemBIT = () => {
        if (!simulateData?.request) return;
        redeemRaw(simulateData.request);
    };

    return {
        redeemBIT,
        isSuccessfulRedeem,
        txData,
        isPending,
        simulateError,
    };
}

// Hook for calculating mint amounts and redeem prices
export function useBITCalculations({
                                       bitContractAddress,
                                       bnoteIds,
                                       bnoteAmounts,
                                   }: {
    bitContractAddress: Address;
    bnoteIds: bigint[];
    bnoteAmounts: bigint[];
}) {
    const { data: calculationData, isLoading } = useReadContracts({
        contracts: [
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "calculateMintAmount",
                args: [bnoteIds, bnoteAmounts],
            },
            {
                address: bitContractAddress,
                abi: bitAbi,
                functionName: "calculateRedeemPrice",
                args: [bnoteIds, bnoteAmounts],
            },
        ],
        query: {
            enabled: bnoteIds.length > 0 && bnoteAmounts.length > 0,
        },
    });

    const mintAmount = calculationData?.[0]?.result as bigint | undefined;
    const redeemData = calculationData?.[1]?.result as [bigint, bigint] | undefined;
    const baseBits = redeemData?.[0];
    const premiumBits = redeemData?.[1];

    return {
        mintAmount: mintAmount || BigInt(0),
        baseBits: baseBits || BigInt(0),
        premiumBits: premiumBits || BigInt(0),
        totalRedeemBits: (baseBits || BigInt(0)) + (premiumBits || BigInt(0)),
        isLoading,
    };
}