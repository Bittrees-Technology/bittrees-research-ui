import { useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useChainId } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";
import { CertificatePicker } from "./CertificatePicker";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
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

export enum PurchaseToken {
  WBTC = "WBTC",
  BTREE = "BTREE",
}

export function MintBNOTE() {
  const [totalCertificates, setTotalCertificates] = useState(0);

  const chainId = useChainId();
  const { address } = useAccount();

  const isSupported = chainId in CONTRACT_CONFIGS;
  const config = isSupported
    ? CONTRACT_CONFIGS[chainId as keyof typeof CONTRACT_CONFIGS]
    : CONTRACT_CONFIGS[1]; // Default to mainnet config

  const { paymentTokens } = usePaymentTokenInformation({
    bnoteContractAddress: config.BNOTE,
  });
  console.log("paymentTokens", paymentTokens);

  const isBTREE = true; //purchaseToken === PurchaseToken.BTREE;
  // const mintPrice = PRICE_PER_DENOMINATION[purchaseToken][denomination];
  const mintPrice = BigInt(0);

  const { allowance, balance, isLoading } = useERC20TokenInformation({
    walletAddress: address,
    contractAddress: config.BNOTE,
    erc20ContractAddress: isBTREE ? config.BTREE : config.WBTC,
  });

  function formatAmount(amount: bigint, decimals: number) {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: decimals === 18 ? 0 : 4,
    });
  }

  const [total, setTotal] = useState(mintPrice);

  const displayValues = {
    mintPrice: formatAmount(mintPrice, isBTREE ? 18 : 8),
    totalPrice: formatAmount(total, isBTREE ? 18 : 8),
    balance: formatAmount(balance, isBTREE ? 18 : 8),
    allowance: formatAmount(allowance, isBTREE ? 18 : 8),
    allowanceToCreate: formatAmount(
      total - allowance < BigInt(0) ? BigInt(0) : total - allowance,
      isBTREE ? 18 : 8
    ),
  };

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
          <CertificatePicker
            totalCertificates={totalCertificates}
            onCertificatesChange={(certs: number) => {
              setTotalCertificates(certs);
            }}
          />
          <div className="mb-6">
            <label className="block text-lg font-semibold text-primary mb-3">
              Select Payment Token
            </label>

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
              <div>0.296 BTREE</div>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 mt-3">
              <div>Total:</div>
              <div>0.296 BTREE</div>
            </div>
          </div>
          <div>
            <div>--DEBUG--</div>
            <div>Allowance: {displayValues.allowance}</div>
            <div>Balance: {displayValues.balance} BTREE</div>
          </div>

          <button
            className="border w-full bg-secondary hover:bg-secondary/90 font-semibold text-lg py-4 px-6 rounded-md transition-all hover:-translate-y-0.5"
            onClick={() => {}}
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
