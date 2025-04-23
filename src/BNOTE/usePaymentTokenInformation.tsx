import { useEffect, useMemo, useState } from "react";
import { Abi, type Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import bnoteAbi from "./abi-bnote.json";

// This is a minimal ERC20 ABI that only includes the functions we need
const ERC20_MINIMAL_ABI = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

export type PaymentToken = {
  name: string;
  address: Address;
  decimals: number;
  mintPriceWeiForOneNote: bigint;
  active: boolean;
};

export type PaymentTokenDictionary = {
  [address: string]: PaymentToken;
};

export function usePaymentTokenInformation({
  bnoteContractAddress,
}: {
  bnoteContractAddress: Address;
}): {
  paymentTokenDictionary: PaymentTokenDictionary;
  isLoading: boolean;
} {
  const [paymentTokenDictionary, setPaymentTokenDictionary] =
    useState<PaymentTokenDictionary>({});

  // First, get all payment token addresses from the contract
  const { data: paymentTokenAddresses, isLoading: isLoadingAddresses } =
    useReadContract({
      address: bnoteContractAddress,
      abi: bnoteAbi as Abi,
      functionName: "getAllPaymentTokenAddresses",
    });

  // Cast the array to Address[] type
  const typedAddresses = paymentTokenAddresses as Address[] | undefined;

  // Once we have the addresses, prepare contract calls for each token
  const contractCalls = useMemo(() => {
    if (!typedAddresses || !Array.isArray(typedAddresses)) {
      return [];
    }

    // Calls to the BNOTE contract to check if tokens are active and get prices
    const bnoteContractCalls = typedAddresses.map((tokenAddress) => ({
      address: bnoteContractAddress,
      abi: bnoteAbi as Abi,
      functionName: "paymentTokens",
      args: [tokenAddress],
    }));

    // Calls to each ERC20 token to get symbol and decimals
    const erc20Calls = typedAddresses.flatMap((tokenAddress) => [
      {
        address: tokenAddress,
        abi: ERC20_MINIMAL_ABI as Abi,
        functionName: "symbol",
      },
      {
        address: tokenAddress,
        abi: ERC20_MINIMAL_ABI as Abi,
        functionName: "decimals",
      },
    ]);

    return [...bnoteContractCalls, ...erc20Calls];
  }, [bnoteContractAddress, typedAddresses]);

  // Execute all the contract calls
  const { data: contractData, isLoading: isLoadingContractData } =
    useReadContracts({
      contracts: contractCalls,
      query: {
        enabled: contractCalls.length > 0,
      },
    });

  useEffect(() => {
    if (!contractData || !typedAddresses) return;

    const tokenCount = typedAddresses.length;

    // Process each token
    const processedTokens = typedAddresses.map((tokenAddress, index) => {
      // The first `tokenCount` results are from the BNOTE contract
      const bnoteResult = contractData[index]?.result as
        | [boolean, bigint]
        | undefined;
      const active = bnoteResult ? bnoteResult[0] : false;
      const mintPriceWeiForOneNote = bnoteResult ? bnoteResult[1] : 0n;

      // The next results are from the ERC20 tokens (2 calls per token)
      const symbolResult = contractData[tokenCount + index * 2]?.result as
        | string
        | undefined;
      const decimalsResult = contractData[tokenCount + index * 2 + 1]
        ?.result as number | undefined;

      return {
        name: symbolResult || `Unknown-${index}`, // Use symbol as name
        address: tokenAddress as Address,
        decimals: decimalsResult ?? 18, // Default to 18 if not available
        mintPriceWeiForOneNote,
        active,
      } as PaymentToken;
    });

    // Filter out inactive tokens
    const activeTokens = processedTokens.filter((token) => token.active);

    // Convert array of PaymentToken to dictionary
    const activeTokensDictionary: PaymentTokenDictionary = {};
    activeTokens.forEach((token) => {
      activeTokensDictionary[token.address] = token;
    });

    // Set the state with the new dictionary
    setPaymentTokenDictionary(activeTokensDictionary);
  }, [contractData, typedAddresses]);

  // Consider loading until both address fetch and all contract calls are done
  const isLoading = isLoadingAddresses || isLoadingContractData;

  return {
    paymentTokenDictionary,
    isLoading,
  };
}
