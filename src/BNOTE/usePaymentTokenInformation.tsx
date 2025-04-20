import { type Address } from "viem";

export type PaymentToken = {
  name: string;
  address: Address;
  mintPrice: number;
  active: boolean;
};

const PAYMENT_TOKENS = [
  {
    name: "BTREE",
    address: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
  },
];

export function usePaymentTokenInformation({
  bnoteContractAddress,
}: {
  bnoteContractAddress: Address;
}): {
  paymentTokens: PaymentToken[];
} {
  // loop through contracts and discover which ones are active and how much mint price is
  const activePaymentTokens = PAYMENT_TOKENS.map((token) => {
    const address = token.address;
    console.log(
      `TODO: call contract to get mint price and active status for token ${token.name} at address ${address} for bnote contract ${bnoteContractAddress}`
    );

    const mintPrice = 0.0;
    const active = true;
    return {
      ...token,
      mintPrice,
      active,
    } as PaymentToken;
  }).filter((token) => token.active);

  return {
    paymentTokens: activePaymentTokens,
  };
}
