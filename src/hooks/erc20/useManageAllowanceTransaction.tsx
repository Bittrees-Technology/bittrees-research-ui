import { useEffect, useState } from "react";
import type { Address } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import erc20MinimalAbi from "@/lib/constants/erc20-minimal.abi.json";

export function useManageAllowanceTransaction({
                                                erc20ContractAddress,
                                                contractAddress,
                                                chainId,
                                                amount,
                                              }: {
  erc20ContractAddress: Address;
  contractAddress: Address;
  chainId: number;
  amount: bigint;
}) {
  const [allowanceHash, setAllowanceHash] = useState<Address | undefined>();

  const {
    data: simulateDataStandard,
    error: errorStandard
  } = useSimulateContract({
    address: erc20ContractAddress,
    abi: erc20MinimalAbi,
    functionName: "increaseAllowance",
    chainId,
    args: [contractAddress, amount],
  });

  const { data: simulateDataLegacy } = useSimulateContract({
    address: erc20ContractAddress,
    abi: erc20MinimalAbi,
    functionName: "increaseApproval",
    chainId,
    args: [contractAddress, amount],
    query: {
      enabled: !!errorStandard && amount > 0n // Only try if standard failed
    },
  });

  // fall back to 'increaseApproval' if 'increaseAllowance' doesn't exist
  const simulateData = simulateDataStandard || simulateDataLegacy;
  const { writeContract, data: writeData } = useWriteContract();

  useEffect(() => {
    if (writeData) {
      setAllowanceHash(writeData);
    }
  }, [writeData]);

  const { data: dataForAllowanceTransaction } = useWaitForTransactionReceipt(
      allowanceHash ? {
        hash: allowanceHash,
        chainId,
        confirmations: 5,
      } : undefined
  );

  function sendAllowance() {
    if (amount <= BigInt(0)) return;
    if (!simulateData?.request) return;
    writeContract(simulateData.request);
  }

  return {
    sendAllowance,
    allowanceTransactionResult: dataForAllowanceTransaction,
  };
}
