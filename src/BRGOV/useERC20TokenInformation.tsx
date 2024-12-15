import { ethers } from "ethers";
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

  const { data: tokenData, isLoading } = useReadContracts({
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
    console.log({ tokenData });
    if (tokenData && tokenData[0]?.result) {
      setAllowance(ethers.BigNumber.from(tokenData[0].result).toBigInt());
    }

    if (tokenData && tokenData[1]?.result) {
      setBalance(ethers.BigNumber.from(tokenData[1].result).toBigInt());
    }
  }, [tokenData]);

  return { allowance, balance, isLoading };
}
