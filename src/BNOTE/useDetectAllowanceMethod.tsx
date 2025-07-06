import { useEffect, useState } from "react";
import type { Address } from "viem";
import { useSimulateContract } from "wagmi";
import btreeAbi from "./abi-btree.json";
import wbtcAbi from "./abi-wbtc.json";

export type AllowanceMethod = "increaseAllowance" | "increaseApproval";

export function useDetectAllowanceMethod({
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
  const [detectedMethod, setDetectedMethod] = useState<AllowanceMethod | null>(
    null
  );
  const [isDetecting, setIsDetecting] = useState(true);

  // Try increaseAllowance first (preferred method)
  const { data: increaseAllowanceData, error: increaseAllowanceError } =
    useSimulateContract({
      address: erc20ContractAddress,
      abi: btreeAbi,
      functionName: "increaseAllowance",
      chainId,
      args: [contractAddress, amount],
      query: {
        enabled: amount > BigInt(0),
      },
    });

  // Try increaseApproval as fallback
  const { data: increaseApprovalData, error: increaseApprovalError } =
    useSimulateContract({
      address: erc20ContractAddress,
      abi: wbtcAbi,
      functionName: "increaseApproval",
      chainId,
      args: [contractAddress, amount],
      query: {
        enabled:
          amount > BigInt(0) &&
          !increaseAllowanceData &&
          !!increaseAllowanceError,
      },
    });

  useEffect(() => {
    if (amount <= BigInt(0)) {
      setDetectedMethod(null);
      setIsDetecting(false);
      return;
    }

    // If increaseAllowance simulation succeeds, use it
    if (increaseAllowanceData) {
      setDetectedMethod("increaseAllowance");
      setIsDetecting(false);
      return;
    }

    // If increaseAllowance fails and increaseApproval succeeds, use increaseApproval
    if (increaseAllowanceError && increaseApprovalData) {
      setDetectedMethod("increaseApproval");
      setIsDetecting(false);
      return;
    }

    // If increaseAllowance fails and increaseApproval also fails, default to increaseAllowance
    if (increaseAllowanceError && increaseApprovalError) {
      setDetectedMethod("increaseAllowance");
      setIsDetecting(false);
      return;
    }

    // If we have an increaseAllowance error but increaseApproval is not enabled/running yet,
    // keep detecting (this handles the case where the second query is conditionally enabled)
    if (
      increaseAllowanceError &&
      !increaseApprovalData &&
      !increaseApprovalError
    ) {
      setIsDetecting(true);
      return;
    }

    // Default: still detecting
    setIsDetecting(true);
  }, [
    increaseAllowanceData,
    increaseAllowanceError,
    increaseApprovalData,
    increaseApprovalError,
    amount,
  ]);

  return {
    detectedMethod,
    isDetecting,
  };
}
