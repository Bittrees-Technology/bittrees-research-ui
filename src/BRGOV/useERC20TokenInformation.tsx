import { useEffect, useState } from "react";
import { useContractReads, Address } from "wagmi";
import { erc20ABI } from "wagmi";
import { ethers } from "ethers";

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

  const { data: tokenData, isLoading } = useContractReads({
    contracts: [
      {
        address: ERC20_CONTRACT_ADDRESS,
        abi: erc20ABI,
        functionName: "allowance",
        args: [walletAddress || "0x0", CONTRACT_ADDRESS],
      },
      {
        address: ERC20_CONTRACT_ADDRESS,
        abi: erc20ABI,
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
