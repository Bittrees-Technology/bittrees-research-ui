import { useEffect, useState } from "react";
import { Abi, type Address } from "viem";
import { useReadContracts } from "wagmi";
import bnoteAbi from "./abi-bnote.json";

export type PaymentToken = {
  name: string;
  address: Address;
  decimals: number;
  mintPriceForOneNote: bigint;
  active: boolean;
};

const PAYMENT_TOKENS = [
  {
    name: "BTREE",
    address: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
    decimals: 18,
  },
];

export function usePaymentTokenInformation({
  bnoteContractAddress,
}: {
  bnoteContractAddress: Address;
}): {
  paymentTokens: PaymentToken[];
  isLoading: boolean;
} {
  const [paymentTokens, setPaymentTokens] = useState<PaymentToken[]>([]);

  // Create contract calls for each payment token
  const contractCalls = PAYMENT_TOKENS.map((token) => ({
    address: bnoteContractAddress,
    abi: bnoteAbi as Abi,
    functionName: "paymentTokens",
    args: [token.address],
  }));

  // Use wagmi's useReadContracts to batch all the calls
  console.log("calling contract paymentTokens");
  const { data, isLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (data) {
      const processedTokens = PAYMENT_TOKENS.map((token, index) => {
        const result = data[index]?.result as [boolean, bigint] | undefined;

        // If we have a result, extract the mintPrice and active status
        // Otherwise, use default values
        const active = result ? result[0] : false;
        const mintPriceForOneNote = result ? result[1] : 0;

        return {
          ...token,
          mintPriceForOneNote,
          active,
        } as PaymentToken;
      });

      // Filter out inactive tokens
      const activeTokens = processedTokens.filter((token) => token.active);
      setPaymentTokens(activeTokens);
    }
  }, [data]);

  return {
    paymentTokens,
    isLoading,
  };
}
