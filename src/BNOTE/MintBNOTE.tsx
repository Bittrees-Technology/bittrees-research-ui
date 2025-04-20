import { useState } from "react";
import { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";
import { CertificatePicker } from "./CertificatePicker";
import { PaymentPicker } from "./PaymentPicker";
import { PaymentSummary } from "./PaymentSummary";
import { usePaymentTokenInformation } from "./usePaymentTokenInformation";

const CONTRACT_CONFIGS = {
  [mainnet.id]: {
    BNOTE: "0x53da448d2CF3f3Bce37D0C9669b94ed9a59aB558",
    BTREE: "0x6bDdE71Cf0C751EB6d5EdB8418e43D3d9427e436",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseApproval", // not using standard ERC20 method
    EXPLORER: "etherscan.io",
  },
  [baseSepolia.id]: {
    BNOTE: "0x53da448d2CF3f3Bce37D0C9669b94ed9a59aB558",
    BTREE: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
    WBTC: "0x5beB73bc1611111C3d5F692a286b31DCDd03Af81",
    WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseAllowance",
    EXPLORER: "sepolia.basescan.org",
  },
  // [base.id]: {
  //   BRGOV: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
  //   BTREE: "0x4DE534be4793C52ACc69A230A0318fF1A06aF8A0",
  //   WBTC: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
  //   WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseAllowance",
  //   EXPLORER: "basescan.org",
  // },
} as const;

export function MintBNOTE() {
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [paymentTokenContractAddress, setPaymentTokenContractAddress] =
    useState<Address | null>(null);

  console.log("paymentTokenContractAddress", paymentTokenContractAddress);

  const chainId = useChainId();
  const { address } = useAccount();

  const isSupported = chainId in CONTRACT_CONFIGS;
  const config = isSupported
    ? CONTRACT_CONFIGS[chainId as keyof typeof CONTRACT_CONFIGS]
    : CONTRACT_CONFIGS[1]; // Default to mainnet config

  const { paymentTokens, isLoading: isLoadingPaymentTokens } =
    usePaymentTokenInformation({
      bnoteContractAddress: config.BNOTE,
    });
  console.log("paymentTokens", paymentTokens);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="md:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-primary pb-3 border-b border-gray-200 mb-4">
            About Bittrees Certificates
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Bittrees Research certificates represent...lorem ipsum dolor sit
            amet. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed.
          </p>
          {!address && <div>Connect wallet to mint.</div>}
          {!paymentTokenContractAddress && (
            <div>Connect has no active payment options.</div>
          )}
          {address && paymentTokenContractAddress && (
            <div>
              <CertificatePicker
                totalCertificates={totalCertificates}
                onCertificatesChange={(certs: number) => {
                  setTotalCertificates(certs);
                }}
              />
              {isLoadingPaymentTokens && (
                <div>Loading payment token options...</div>
              )}
              <PaymentPicker
                paymentTokens={paymentTokens}
                onPaymentChange={setPaymentTokenContractAddress}
              />
              <PaymentSummary
                bnoteContractAddress={config.BNOTE}
                erc20ContractAddress={config.BTREE}
                erc20Decimals={18}
                totalCertificates={totalCertificates}
                userWalletAddress={address}
              />
              <button
                className="border w-full bg-secondary hover:bg-secondary/90 font-semibold text-lg py-4 px-6 rounded-md transition-all hover:-translate-y-0.5"
                onClick={() => {}}
              >
                Mint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
