import { useEffect, useState } from "react";
import type { Address } from "viem";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export function useManageAllowanceTransaction({
  erc20ContractAddress,
  erc20FunctionName,
  erc20Abi,
  contractAddress,
  chainId,
  amount,
}: {
  erc20ContractAddress: Address;
  erc20FunctionName: "increaseAllowance" | "increaseApproval";
  erc20Abi: any;
  contractAddress: Address;
  chainId: number;
  amount: bigint;
}) {
  const [allowanceHash, setAllowanceHash] = useState<Address | undefined>();

  const { data: simulateData } = useSimulateContract({
    address: erc20ContractAddress,
    abi: erc20Abi,
    functionName: erc20FunctionName,
    chainId,
    args: [contractAddress, amount],
  });

  const { writeContract, data: writeData } = useWriteContract();

  useEffect(() => {
    if (writeData) {
      setAllowanceHash(writeData);
    }
  }, [writeData]);

  // Removed 'enabled' option as it's no longer supported
  const { data: dataForAllowanceTransaction } = useWaitForTransactionReceipt({
    hash: allowanceHash,
    chainId,
    confirmations: 5,
  });

  useEffect(() => {
    console.log("useManageAllowanceTransaction:", {
      dataForAllowanceTransaction,
    });
  }, [dataForAllowanceTransaction]);

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
