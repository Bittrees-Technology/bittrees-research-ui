import { useEffect, useMemo, useState } from "react";
import { Abi, type Address } from "viem";
import { useReadContracts } from "wagmi";
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

// Include only addresses initially, we'll fetch the rest
const PAYMENT_TOKENS = [
  {
    address: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2" as Address, // BTREE
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" as Address, // WBTC
  },
];

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

  // Create contract calls for both the BNOTE contract and the ERC20 tokens
  const contractCalls = useMemo(() => {
    // Calls to the BNOTE contract to check if tokens are active and get prices
    const bnoteContractCalls = PAYMENT_TOKENS.map((token) => ({
      address: bnoteContractAddress,
      abi: bnoteAbi as Abi,
      functionName: "paymentTokens",
      args: [token.address],
    }));

    // Calls to each ERC20 token to get symbol and decimals
    const erc20Calls = PAYMENT_TOKENS.flatMap((token) => [
      {
        address: token.address,
        abi: ERC20_MINIMAL_ABI as Abi,
        functionName: "symbol",
      },
      {
        address: token.address,
        abi: ERC20_MINIMAL_ABI as Abi,
        functionName: "decimals",
      },
    ]);

    return [...bnoteContractCalls, ...erc20Calls];
  }, [bnoteContractAddress]);

  // Call all contracts
  const { data, isLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (!data) return;

    const tokenCount = PAYMENT_TOKENS.length;

    // Process each token
    const processedTokens = PAYMENT_TOKENS.map((token, index) => {
      // The first `tokenCount` results are from the BNOTE contract
      const bnoteResult = data[index]?.result as [boolean, bigint] | undefined;
      const active = bnoteResult ? bnoteResult[0] : false;
      const mintPriceWeiForOneNote = bnoteResult ? bnoteResult[1] : 0n;

      // The next results are from the ERC20 tokens (2 calls per token)
      const symbolResult = data[tokenCount + index * 2]?.result as
        | string
        | undefined;
      const decimalsResult = data[tokenCount + index * 2 + 1]?.result as
        | number
        | undefined;

      return {
        name: symbolResult || `Unknown-${index}`, // Use symbol as name if available
        address: token.address,
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
  }, [data]);

  return {
    paymentTokenDictionary,
    isLoading,
  };
}
