import { Address } from "viem";
import { useMintingInfo } from "./useMintingInfo";
import { PaymentToken } from "./usePaymentTokenInformation";

export function PaymentSummary({
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
  const { isLoading, displayValues } = useMintingInfo({
    totalCertificates,
    bnoteContractAddress,
    erc20PaymentToken,
    userWalletAddress,
  });

  return (
    <div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-primary mb-3">
          Payment Summary
        </label>

        {isLoading && <div>Loading...</div>}
      </div>

      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <div className="flex justify-between mb-2">
          <div>Price ({totalCertificates} certificates):</div>
          <div>
            {displayValues.totalPrice} {erc20PaymentToken.name}
          </div>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 mt-3">
          <div>Total:</div>
          <div>
            {displayValues.totalPrice} {erc20PaymentToken.name}
          </div>
        </div>
      </div>
      <div>
        <div>-- USER'S WALLET --</div>
        <div>
          Current allowance on {erc20PaymentToken.name} is{" "}
          {displayValues.allowance}
        </div>
        <div>
          Allowance we need to create on {erc20PaymentToken.name} is{" "}
          {displayValues.allowanceToCreate}
        </div>
        <div>
          Balance: {displayValues.balance} {erc20PaymentToken.name}
        </div>
      </div>
    </div>
  );
}
