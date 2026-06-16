/*
This React hook fetches two key pieces of ERC20 token information
in a single batch: the wallet's token balance and the spending
allowance granted to a specific contract. It stores these values
as BigInts in local state and returns them along with a loading
flag, making it easy to check if a user has enough tokens and
appropriate permissions before executing token-related transactions.
*/

import { useEffect, useState } from "react";
import { type Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export function useERC20TokenInformation({
  walletAddress,
  contractAddress,
  erc20ContractAddress,
}: {
  walletAddress?: Address;
  contractAddress: Address;
  erc20ContractAddress: Address;
}) {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const {
    data: tokenData,
    isLoading,
    refetch,
  } = useReadContracts({
    contracts: [
      {
        address: erc20ContractAddress,
        abi: erc20Abi,
        functionName: "allowance",
        args: [walletAddress || "0x0", contractAddress],
      },
      {
        address: erc20ContractAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [walletAddress || "0x0"],
      },
    ],
  });

  useEffect(() => {
    // wagmi/viem already return these as native bigint — no ethers needed.
    if (tokenData && tokenData[0]?.result !== undefined) {
      setAllowance(tokenData[0].result as bigint);
    }

    if (tokenData && tokenData[1]?.result !== undefined) {
      setBalance(tokenData[1].result as bigint);
    }
  }, [tokenData]);

  return { allowanceWei: allowance, balanceWei: balance, isLoading, refetch };
}
