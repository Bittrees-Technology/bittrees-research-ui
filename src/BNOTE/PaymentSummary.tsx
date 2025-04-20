import { Address, formatUnits } from "viem";
import { useERC20TokenInformation } from "./useERC20TokenInformation";

export function PaymentSummary({
  totalCertificates,
  bnoteContractAddress,
  erc20ContractAddress,
  erc20Decimals,
  userWalletAddress,
}: {
  totalCertificates: number;
  bnoteContractAddress: Address;
  erc20ContractAddress: Address;
  erc20Decimals: number;
  userWalletAddress: Address;
}) {
  const mintPrice = BigInt(1000);

  const total = BigInt(totalCertificates) * mintPrice;

  const {
    allowance,
    balance,
    isLoading: isLoadingERC20,
  } = useERC20TokenInformation({
    walletAddress: userWalletAddress,
    contractAddress: bnoteContractAddress,
    erc20ContractAddress: erc20ContractAddress,
  });

  // Combined loading state
  const isLoading = isLoadingERC20;

  function formatAmount(amount: bigint, decimals: number) {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: decimals === 18 ? 0 : 4,
    });
  }

  const displayValues = {
    mintPrice: formatAmount(mintPrice, erc20Decimals),
    totalPrice: formatAmount(total, erc20Decimals),
    balance: formatAmount(balance, erc20Decimals),
    allowance: formatAmount(allowance, erc20Decimals),
    allowanceToCreate: formatAmount(
      total - allowance < BigInt(0) ? BigInt(0) : total - allowance,
      erc20Decimals
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
          <div>{total} BTREE</div>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 mt-3">
          <div>Total:</div>
          <div>{total} BTREE</div>
        </div>
      </div>
      <div>
        <div>--DEBUG--</div>
        <div>Allowance: {displayValues.allowance}</div>
        <div>Balance: {displayValues.balance} BTREE</div>
      </div>
    </div>
  );
}
