import {
  PaymentToken,
  PaymentTokenDictionary,
} from "./usePaymentTokenInformation";

export type PaymentPickerProps = {
  paymentTokenDictionary: PaymentTokenDictionary;
  currentPaymentToken: PaymentToken;
  onPaymentChange: (paymentToken: PaymentToken) => void;
};

export function PaymentPicker({
  paymentTokenDictionary,
  currentPaymentToken,
  onPaymentChange,
}: PaymentPickerProps) {
  const tokens = Object.entries(paymentTokenDictionary).map(
    ([, value]) => value
  );

  return (
    <div>
      <div className="mb-6">
        <label className="block text-lg font-semibold text-primary mb-3">
          Select Payment Token
        </label>

        {tokens.length === 0 && (
          <div className="text-red-500">No payment options</div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {tokens.map((token) => (
            <button
              key={token.address}
              onClick={() => onPaymentChange(token)}
              className={`border-2 rounded-md p-3 flex items-center gap-2 cursor-pointer transition-colors
      ${
        token.address === currentPaymentToken?.address
          ? "border-secondary font-bold"
          : "border-gray-200 hover:border-secondary"
      }`}
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary">
                {token.name[0]}
              </div>
              <div
                className={`${
                  token.address === currentPaymentToken?.address
                    ? "font-bold"
                    : "font-semibold"
                }`}
              >
                {token.name}
              </div>
            </button>
          ))}{" "}
        </div>
      </div>
    </div>
  );
}
