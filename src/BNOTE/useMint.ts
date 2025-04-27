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

  const { data: simulateData, isLoading: isSimulating } = useSimulateContract({
    address: bnoteContractAddress,
    abi: bnoteAbi,
    functionName: "mintBatch",
    args: [tokenIds, amounts, paymentToken.address],
  });

  const {
    writeContract: mintItRaw,
    data: txData,
    isSuccess: isSuccessfulMint,
    isPending,
  } = useWriteContract();

  // Function to safely call mintIt only when simulation data is available
  const mintIt = () => {
    if (!simulateData?.request) {
      console.warn("Cannot mint: simulation data is not available yet");
      return;
    }
    mintItRaw(simulateData.request);
  };

  return {
    mintIt,
    isSuccessfulMint,
    txData,
    isSimulating,
    isPending,
    isReadyToMint: !!simulateData?.request,
  };
}
