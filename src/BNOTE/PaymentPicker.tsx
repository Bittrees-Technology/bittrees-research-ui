import { Address, formatUnits } from "viem";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
import { usePaymentTokenInformation } from "./usePaymentTokenInformation";

export function PaymentPicker({
  totalCertificates,
  bnoteContractAddress,
  erc20ContractAddress,
  erc20Decimals,
  userWalletAddress,
  onPaymentChange,
}: {
  totalCertificates: number;
  bnoteContractAddress: Address;
  erc20ContractAddress: Address;
  erc20Decimals: number;
  userWalletAddress: Address;
  onPaymentChange: (paymentTokenContractAddress: Address) => void;
}) {
  const { paymentTokens, isLoading: isLoadingPaymentTokens } =
    usePaymentTokenInformation({
      bnoteContractAddress,
    });
  console.log("paymentTokens", paymentTokens);

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
  const isLoading = isLoadingPaymentTokens || isLoadingERC20;

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
          Select Payment Token
        </label>

        {isLoading && <div>Loading...</div>}

        <div className="grid grid-cols-3 gap-3">
          {/* <div className="border-2 border-secondary bg-secondary/10 rounded-md p-3 flex items-center gap-2 cursor-pointer">
      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
        W
      </div>
      <div className="font-semibold">WBTC</div>
    </div> */}

          <div className="border-2 border-gray-200 rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition-colors">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
              B
            </div>
            <div className="font-semibold">BTREE</div>
          </div>

          {/* <div className="border-2 border-gray-200 rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition-colors">
      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
        U
      </div>
      <div className="font-semibold">USDC</div>
    </div> */}
        </div>
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
