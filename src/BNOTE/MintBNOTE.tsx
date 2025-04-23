import { useEffect, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { AllowanceAndMint } from "./AllowanceAndMint";
import { CertificatePicker } from "./CertificatePicker";
import { PaymentPicker } from "./PaymentPicker";
import { PaymentSummary } from "./PaymentSummary";
import {
  PaymentToken,
  usePaymentTokenInformation,
} from "./usePaymentTokenInformation";

const BNOTE_CONTRACT_CONFIGS = {
  [mainnet.id]: {
    BNOTE: "0xEC0f5e4d5B458a8d9337589a7e31Ef95149ee845",
    WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseApproval", // not using standard ERC20 method
    EXPLORER: "etherscan.io",
  },
  [baseSepolia.id]: {
    BNOTE: "0xEC0f5e4d5B458a8d9337589a7e31Ef95149ee845",
    WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseAllowance",
    EXPLORER: "sepolia.basescan.org",
  },
  [base.id]: {
    BNOTE: "0xEC0f5e4d5B458a8d9337589a7e31Ef95149ee845",
    WBTC_INCREASE_ALLOWANCE_METHOD_NAME: "increaseAllowance",
    EXPLORER: "basescan.org",
  },
} as const;

export function MintBNOTE() {
  const [totalCertificates, setTotalCertificates] = useState(0);

  const chainId = useChainId();
  const { address } = useAccount();

  const result = useBalance({
    address,
  });
  const walletBalance = result.data?.value ?? BigInt(0);

  const isSupported = chainId in BNOTE_CONTRACT_CONFIGS;
  const config = isSupported
    ? BNOTE_CONTRACT_CONFIGS[chainId as keyof typeof BNOTE_CONTRACT_CONFIGS]
    : BNOTE_CONTRACT_CONFIGS[1]; // Default to mainnet config

  const { paymentTokenDictionary, isLoading: isLoadingPaymentTokens } =
    usePaymentTokenInformation({
      bnoteContractAddress: config.BNOTE,
    });

  const tokenKeys = Object.keys(paymentTokenDictionary);
  const [currentPaymentToken, setCurrentPaymentToken] = useState<
    PaymentToken | undefined
  >(undefined);

  useEffect(() => {
    if (tokenKeys.length > 0 && !currentPaymentToken) {
      const firstTokenKey = tokenKeys[0];
      const firstToken = paymentTokenDictionary[firstTokenKey];
      setCurrentPaymentToken(firstToken);
    }
  }, [tokenKeys, currentPaymentToken, paymentTokenDictionary]);

  const readyToMint = address && currentPaymentToken?.address;

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
          {address && !currentPaymentToken && (
            <div className="text-red-500">
              BNOTE contract on the current blockchain network has no active
              payment options enabled. Unable to mint.
            </div>
          )}
          {!address && (
            <div className="text-red-500">
              Please connect your wallet to mint.
            </div>
          )}
          {readyToMint && (
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
                paymentTokenDictionary={paymentTokenDictionary}
                currentPaymentToken={currentPaymentToken}
                onPaymentChange={setCurrentPaymentToken}
              />
              <PaymentSummary
                bnoteContractAddress={config.BNOTE}
                erc20PaymentToken={currentPaymentToken}
                totalCertificates={totalCertificates}
                userWalletAddress={address}
              />

              <AllowanceAndMint
                walletBalance={walletBalance}
                bnoteContractAddress={config.BNOTE}
                erc20PaymentToken={currentPaymentToken}
                totalCertificates={totalCertificates}
                userWalletAddress={address}
                chainId={chainId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
