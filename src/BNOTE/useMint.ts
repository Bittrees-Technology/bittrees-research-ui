import { useSimulateContract, useWriteContract } from "wagmi";
import bnoteAbi from "./abi-bnote.json";
import { Address } from "viem";
import { PaymentToken } from "./usePaymentTokenInformation";
import {
  convertCertificatesToDenominations,
  denominationsToMintBatch,
} from "../lib/certificate-math";

export function useMint({
  bnoteContractAddress,
  paymentToken,
  totalCertificates,
}: {
  bnoteContractAddress: Address;
  paymentToken: PaymentToken;
  totalCertificates: number;
}) {
  const { tokenIds, amounts } = denominationsToMintBatch(
    convertCertificatesToDenominations(totalCertificates)
  );

  const { data: simulateData } = useSimulateContract({
    address: bnoteContractAddress,
    abi: bnoteAbi,
    functionName: "mintBatch",
    args: [tokenIds, amounts, paymentToken.address],
  });

  const { writeContract: mintIt, data: txData, isSuccess } = useWriteContract();

  return {
    mintIt,
    isSuccess,
    txData,
    request: simulateData?.request,
  };
}
