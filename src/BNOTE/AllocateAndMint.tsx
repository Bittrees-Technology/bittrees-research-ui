import { Address } from "viem";
import { PaymentToken } from "./usePaymentTokenInformation";

export function AllocateAndMint({
  totalCertificates,
  bnoteContractAddress,
  erc20PaymentToken,
  userWalletAddress,
}: {
  totalCertificates: number;
  bnoteContractAddress: Address;
  erc20PaymentToken: PaymentToken;
  userWalletAddress: Address;
}) {
  return (
    <div>
      <div className="m-4 mt-8 mx-auto max-w-xl">
        <p className="text-xl underline">What's required for minting?</p>
        <p className="mt-2">
          To transfer {erc20PaymentToken.name} tokens, you'll need ETH in your
          wallet. There will be two transactions. The first to grant permissions
          for our contract to transfer {erc20PaymentToken.name} tokens on your
          behalf, the second to do the transfer and mint your equity tokens.
        </p>
      </div>
      <button
        className="border w-full bg-secondary hover:bg-secondary/90 font-semibold text-lg py-4 px-6 rounded-md transition-all hover:-translate-y-0.5"
        onClick={() => {}}
      >
        Mint
      </button>
      ;
    </div>
  );
}
