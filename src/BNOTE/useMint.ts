import { Address } from "viem";
import { useWriteContract } from "wagmi";
import {
  convertCertificatesToDenominations,
  denominationsToMintBatch,
} from "../lib/certificate-math";
import bnoteAbi from "./abi-bnote.json";
import { PaymentToken } from "./usePaymentTokenInformation";

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

  const {
    writeContract: mintItRaw,
    data: txData,
    isSuccess: isSuccessfulMint,
    isPending,
  } = useWriteContract();

  // Function to safely call mintIt only when simulation data is available
  const mintIt = () => {
    mintItRaw({
      address: bnoteContractAddress,
      abi: bnoteAbi,
      functionName: "mintBatch",
      args: [tokenIds, amounts, paymentToken.address],
    });
  };

  return {
    mintIt,
    isSuccessfulMint,
    txData,
    isPending,
  };
}
