import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { type Address, erc20Abi } from "viem";
import { useReadContracts } from "wagmi";

export function useERC20TokenInformation({
  walletAddress,
  CONTRACT_ADDRESS,
  ERC20_CONTRACT_ADDRESS,
}: {
  walletAddress?: Address;
  CONTRACT_ADDRESS: Address;
  ERC20_CONTRACT_ADDRESS: Address;
}) {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const { data: tokenData, isLoading } = useReadContracts({
    contracts: [
      {
        address: ERC20_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [walletAddress || "0x0", CONTRACT_ADDRESS],
      },
      {
        address: ERC20_CONTRACT_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [walletAddress || "0x0"],
      },
    ],
  });

  useEffect(() => {
    console.log({ tokenData });
    if (tokenData && tokenData[0]) {
      setAllowance(ethers.BigNumber.from(tokenData[0]).toBigInt());
    }

    if (tokenData && tokenData[1]) {
      setBalance(ethers.BigNumber.from(tokenData[1]).toBigInt());
    }
  }, [tokenData]);

  return { allowance, balance, isLoading };
}
