import { Address } from "viem";
import { PaymentToken } from "./usePaymentTokenInformation";

export function PaymentPicker({
  paymentTokens,
  onPaymentChange,
}: {
  paymentTokens: PaymentToken[];
  onPaymentChange: (paymentTokenContractAddress: Address) => void;
}) {
  return (
    <div>
      <div>paymentTokens: {paymentTokens.map((token) => token.name)}</div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-primary mb-3">
          Select Payment Token
        </label>

        <div className="grid grid-cols-3 gap-3">
          <div className="border-2 border-gray-200 rounded-md p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition-colors">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
              B
            </div>
            <div className="font-semibold">BTREE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
