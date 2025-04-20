import { Address, formatUnits, parseUnits } from "viem";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
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
  const mintPriceWei = erc20PaymentToken.mintPriceWeiForOneNote;
  const totalPriceWei = BigInt(totalCertificates) * mintPriceWei;

  const {
    allowanceWei,
    balanceWei,
    isLoading: isLoadingERC20,
  } = useERC20TokenInformation({
    walletAddress: userWalletAddress,
    contractAddress: bnoteContractAddress,
    erc20ContractAddress: erc20PaymentToken.address,
  });

  // Combined loading state
  const isLoading = isLoadingERC20;

  function formatAmount(amount: bigint, decimals: number) {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: decimals === 18 ? 0 : 4,
    });
  }

  const decimals = erc20PaymentToken.decimals;
  const displayValues = {
    mintPrice: formatAmount(mintPriceWei, decimals),
    totalPrice: formatAmount(totalPriceWei, decimals),
    balance: formatAmount(balanceWei, decimals),
    allowance: formatAmount(allowanceWei, decimals),
    allowanceToCreate: formatAmount(
      totalPriceWei - allowanceWei < BigInt(0)
        ? BigInt(0)
        : totalPriceWei - allowanceWei,
      decimals
    ),
  };

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
