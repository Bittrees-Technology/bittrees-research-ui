import { useEffect, useMemo, useState } from "react";
import { Abi, parseUnits, type Address } from "viem";
import { useReadContracts } from "wagmi";
import bnoteAbi from "./abi-bnote.json";

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

// TODO: When v2 contract changes, we can bring in all details from BNOTE contract
// plus looks up get name and decimals on ERC20 contracts.
const PAYMENT_TOKENS = [
  {
    name: "BTREE",
    address: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
    decimals: 18,
  },
  {
    name: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
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

  // Memoize the contract calls to prevent recreation on every render
  const contractCalls = useMemo(
    () =>
      PAYMENT_TOKENS.map((token) => ({
        address: bnoteContractAddress,
        abi: bnoteAbi as Abi,
        functionName: "paymentTokens",
        args: [token.address],
      })),
    [bnoteContractAddress] // Only recreate when bnoteContractAddress changes
  );

  // Now useReadContracts will only be called when contractCalls changes
  // which happens only when bnoteContractAddress changes
  const { data, isLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (!data) return;

    const processedTokens = PAYMENT_TOKENS.map((token, index) => {
      const result = data[index]?.result as [boolean, bigint] | undefined;
      const active = result ? result[0] : false;
      const mintPriceWeiForOneNote = result ? result[1] : 0n;

      return {
        ...token,
        mintPriceWeiForOneNote,
        active,
      } as PaymentToken;
    });

    // Filter out inactive tokens
    const activeTokens = processedTokens.filter((token) => token.active);

    // convert array of PaymentToken to dictionary
    const activeTokensDictionary: PaymentTokenDictionary = {};
    activeTokens.forEach((token) => {
      activeTokensDictionary[token.address] = {
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        mintPriceWeiForOneNote: token.mintPriceWeiForOneNote,
        active: token.active,
      };
    });
    // Set the state with the new dictionary
    setPaymentTokenDictionary(activeTokensDictionary);
  }, [data]);

  return {
    paymentTokenDictionary,
    isLoading,
  };
}
