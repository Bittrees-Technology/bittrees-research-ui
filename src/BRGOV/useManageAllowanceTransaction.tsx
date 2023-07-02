import { useEffect, useState } from "react";
import {
  Address,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

export function useManageAllowanceTransaction({
  ERC20_CONTRACT_ADDRESS,
  erc20FunctionName,
  erc20Abi,
  CONTRACT_ADDRESS,
  chainId,
  amount,
}: {
  ERC20_CONTRACT_ADDRESS: Address;
  erc20FunctionName: "increaseAllowance" | "increaseApproval";
  erc20Abi: any;
  CONTRACT_ADDRESS: Address;
  chainId: number;
  amount: bigint;
}) {
  const { config: configAllowance } = usePrepareContractWrite({
    address: ERC20_CONTRACT_ADDRESS,
    abi: erc20Abi,
    functionName: erc20FunctionName,
    chainId,
    args: [CONTRACT_ADDRESS, amount.toString()],
  });

  const [allowanceHash, setAllowanceHash] = useState<Address | undefined>();

  const { data: allowanceData, write: writeAllowance } =
    useContractWrite(configAllowance);

  useEffect(() => {
    if (allowanceData?.hash) {
      setAllowanceHash(allowanceData?.hash);
    }
  }, [allowanceData]);

  const { data: dataForAllowanceTransaction } = useWaitForTransaction({
    hash: allowanceHash,
    chainId,
    enabled: Boolean(allowanceHash),
  });

  useEffect(() => {
    console.log("useManageAllowanceTransaction: Successful", {
      dataForAllowanceTransaction,
    });
  }, [dataForAllowanceTransaction]);

  function sendAllowance() {
    if (amount <= BigInt(0)) return;
    writeAllowance?.();
  }

  return {
    sendAllowance,
    allowanceTransactionResult: dataForAllowanceTransaction,
  };
}
