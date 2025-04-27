import { useEffect, useState } from "react";
import { Address } from "viem";
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
  const [mintComplete, setMintComplete] = useState(false);
  const [mintTransaction, setMintTransaction] = useState<Address | undefined>();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  const chainId = useChainId();
  const explorerDomain =
    BNOTE_CONTRACT_CONFIGS[chainId as keyof typeof BNOTE_CONTRACT_CONFIGS]
      .EXPLORER;
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

  const readyToMint = address && currentPaymentToken?.address && !mintComplete;

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

              <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="disclaimer"
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                  <label
                    htmlFor="disclaimer"
                    className="ml-2 text-sm text-gray-700"
                  >
                    I understand that by minting these certificates, I
                    acknowledge that this is a non-refundable transaction. The
                    BNOTE tokens represent certificates in Bittrees Research and
                    are subject to the terms outlined in the project
                    documentation.
                  </label>
                </div>
              </div>

              <AllowanceAndMint
                walletBalance={walletBalance}
                bnoteContractAddress={config.BNOTE}
                erc20PaymentToken={currentPaymentToken}
                totalCertificates={totalCertificates}
                userWalletAddress={address}
                chainId={chainId}
                disclaimerAccepted={disclaimerAccepted}
                mintComplete={(transactionHash) => {
                  setMintComplete(true);
                  setMintTransaction(transactionHash);
                }}
              />
            </div>
          )}
          {mintComplete && (
            <div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-primary mb-3">
                  BNOTE minting completed!
                </p>
                <p>
                  Your transaction has been successfully completed. You can view
                  it{" "}
                  <a
                    href={`https://${explorerDomain}/tx/${mintTransaction}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    here
                  </a>
                  .
                </p>
                <p className="mt-2">
                  You can now view your BNOTE tokens in your wallet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
