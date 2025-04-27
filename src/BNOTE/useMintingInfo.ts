import { Address, formatUnits } from "viem";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
import { PaymentToken } from "./usePaymentTokenInformation";

export function useMintingInfo({
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
  const decimals = erc20PaymentToken.decimals;
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

  const amountOfAllowanceNeededWei =
    totalPriceWei - allowanceWei < BigInt(0)
      ? BigInt(0)
      : totalPriceWei - allowanceWei;

  return {
    isLoading,
    amountOfAllowanceNeededWei,
    totalPriceWei,
    balanceWei,
    displayValues: {
      mintPrice: formatAmount(mintPriceWei, decimals),
      totalPrice: formatAmount(totalPriceWei, decimals),
      balance: formatAmount(balanceWei, decimals),
      allowance: formatAmount(allowanceWei, decimals),
      allowanceToCreate: formatAmount(amountOfAllowanceNeededWei, decimals),
    },
  };
}
