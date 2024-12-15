import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";

import abi from "./abi-brgov.json";
import btreeAbi from "./abi-btree.json";
import wbtcTestAbi from "./abi-wbtc-test.json";
import wbtcAbi from "./abi-wbtc.json";

import { useERC20TokenInformation } from "./useERC20TokenInformation";
import { useManageAllowanceTransaction } from "./useManageAllowanceTransaction";

// Contract configurations by network
const CONTRACT_CONFIGS = {
  [mainnet.id]: {
    BRGOV: "0x1a8b6b0f57876f5a1a17539c25f9e4235cf7060c",
    BTREE: "0x6bDdE71Cf0C751EB6d5EdB8418e43D3d9427e436",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    EXPLORER: "etherscan.io",
  },
  [baseSepolia.id]: {
    BRGOV: "0x3b66BDdd1FfA50B3F816D8398e55B7FF269a7a42",
    BTREE: "0xCa6f24a651bc4Ab545661a41a81EF387086a34C2",
    WBTC: "0x5beB73bc1611111C3d5F692a286b31DCDd03Af81",
    EXPLORER: "sepolia.basescan.org",
  },
} as const;

export enum Denomination {
  One = "1",
  Ten = "10",
  Hundred = "100",
}

export enum PurchaseToken {
  WBTC = "WBTC",
  BTREE = "BTREE",
}

export interface MintBRGOVProps {
  denomination: Denomination;
  purchaseToken: PurchaseToken;
}

const PRICE_PER_DENOMINATION = {
  [PurchaseToken.WBTC]: {
    [Denomination.One]: parseUnits("0.001", 8), // 0.001 WBTC
    [Denomination.Ten]: parseUnits("0.01", 8), // 0.01 WBTC
    [Denomination.Hundred]: parseUnits("0.1", 8), // 0.1 WBTC
  },
  [PurchaseToken.BTREE]: {
    [Denomination.One]: parseUnits("1000", 18), // 1000 BTREE
    [Denomination.Ten]: parseUnits("10000", 18), // 10000 BTREE
    [Denomination.Hundred]: parseUnits("100000", 18), // 100000 BTREE
  },
};

const MINT_METHODS = {
  [Denomination.One]: "mint",
  [Denomination.Ten]: "mintTen",
  [Denomination.Hundred]: "mintHundred",
} as const;

enum MintState {
  NotConnected,
  AllowanceStep,
  AllowanceTransactionInProgress,
  MintStep,
  MintTransactionInProgress,
  MintComplete,
}

export function MintBRGOV({ denomination, purchaseToken }: MintBRGOVProps) {
  const chainId = useChainId();
  const { address } = useAccount();

  const isSupported = chainId in CONTRACT_CONFIGS;
  const config = isSupported
    ? CONTRACT_CONFIGS[chainId as keyof typeof CONTRACT_CONFIGS]
    : CONTRACT_CONFIGS[1]; // Default to mainnet config

  const isBTREE = purchaseToken === PurchaseToken.BTREE;
  const mintPrice = PRICE_PER_DENOMINATION[purchaseToken][denomination];

  const [mintCount, setMintCount] = useState(1);
  const [total, setTotal] = useState(mintPrice);
  const [allowanceInProgress, setAllowanceInProgress] = useState(false);
  const [mintInProgress, setMintInProgress] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [mintTransactionUrl, setMintTransactionUrl] = useState("");

  const { allowance, balance, isLoading } = useERC20TokenInformation({
    walletAddress: address,
    contractAddress: config.BRGOV,
    erc20ContractAddress: isBTREE ? config.BTREE : config.WBTC,
  });

  const { data: simulateData } = useSimulateContract({
    address: config.BRGOV,
    abi, // Import your ABI
    functionName: MINT_METHODS[denomination],
    args: [isBTREE ? 0x0 : 0x1, address, BigInt(mintCount)],
  });

  const { writeContract, data: txData, isSuccess } = useWriteContract();

  const { sendAllowance, allowanceTransactionResult } =
    useManageAllowanceTransaction({
      erc20ContractAddress: isBTREE ? config.BTREE : config.WBTC,
      erc20Abi: isBTREE
        ? btreeAbi
        : chainId === baseSepolia.id
        ? wbtcTestAbi
        : wbtcAbi,
      erc20FunctionName:
        chainId === baseSepolia.id || isBTREE
          ? "increaseAllowance"
          : "increaseApproval",
      contractAddress: config.BRGOV,
      amount: total - allowance < BigInt(0) ? BigInt(0) : total - allowance,
      chainId,
    });

  function calcTotal(count: string) {
    const newCount = parseInt(count || "0", 10);
    setMintCount(newCount);
    setTotal(mintPrice * BigInt(newCount));
  }

  function formatAmount(amount: bigint, decimals: number) {
    return parseFloat(formatUnits(amount, decimals)).toLocaleString(undefined, {
      maximumFractionDigits: decimals === 18 ? 0 : 4,
    });
  }

  useEffect(() => {
    if (isSuccess && txData) {
      setMintInProgress(false);
      setMintComplete(true);
      setMintTransactionUrl(`https://${config.EXPLORER}/tx/${txData}`);
    }
  }, [isSuccess, txData, config.EXPLORER]);

  useEffect(() => {
    setAllowanceInProgress(false);
  }, [allowanceTransactionResult, allowance, total]);

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

  const enoughAllowanceToMint = allowance >= total;
  const notEnoughTokensToMint = balance < total;

  let mintState = MintState.NotConnected;
  if (address) {
    if (mintComplete) {
      mintState = MintState.MintComplete;
    } else if (allowanceInProgress) {
      mintState = MintState.AllowanceTransactionInProgress;
    } else if (mintInProgress) {
      mintState = MintState.MintTransactionInProgress;
    } else if (enoughAllowanceToMint || allowanceTransactionResult) {
      // TODO: Recheck allowance instead of assuming it's granted with allowanceTransactionResult
      mintState = MintState.MintStep;
    } else {
      mintState = MintState.AllowanceStep;
    }
  }

  if (!isSupported) {
    return (
      <div className="text-red-500 p-4">
        Please connect to a supported network.
      </div>
    );
  }

  if (!address) {
    return (
      <div>
        <p className="text-2xl mt-4">Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <>
      {mintState !== MintState.MintComplete && (
        <div>
          <div className="grid grid-cols-2 gap-6 justify-start font-newtimesroman">
            <div className="text-right">Certificate Denomination:</div>
            <div className="text-left">{`BRGOV-${denomination}`}</div>

            <div className="text-right">Cost per BRGOV token:</div>
            <div className="text-left">
              {displayValues.mintPrice} {purchaseToken}
            </div>

            <div className="text-right">Number of tokens to mint:</div>
            <div className="text-left">
              <input
                className="w-20 input-sm"
                type="number"
                onChange={(e) => calcTotal(e.target.value)}
                step="1"
                min="1"
                value={mintCount}
              />
            </div>

            <div className="text-right">Total price:</div>
            <div className="text-left">
              {displayValues.totalPrice} <span>{purchaseToken}</span>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-2 font-newtimesroman">
              Loading your {purchaseToken} holdings and allowance information...
            </div>
          ) : (
            <div className="mt-6 font-newtimesroman w-1/2 mx-auto">
              <p className="text-xl underline">Your {purchaseToken} Holdings</p>
              <p className="mt-2">
                Your {purchaseToken} holdings are {displayValues.balance}.{" "}
                {notEnoughTokensToMint && (
                  <span className="font-bold text-red-500">
                    Note that your wallet does not have enough {purchaseToken}{" "}
                    tokens to mint {mintCount} BRGOV token
                    {mintCount > 1 ? "s" : ""}.
                  </span>
                )}
              </p>
              <p className="mt-2">
                The allowance of {purchaseToken} you've granted for minting is{" "}
                {displayValues.allowance}.
              </p>
            </div>
          )}

          <div className="m-4 mt-8 mx-auto max-w-xl font-newtimesroman">
            <p className="text-xl underline">What's required for minting?</p>
            <p className="mt-2">
              To transfer {purchaseToken} tokens, you'll need ETH in your
              wallet. There will be two transactions. The first to grant
              permissions for our contract to transfer {purchaseToken} tokens on
              your behalf, the second to do the transfer and mint your equity
              tokens.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 font-newtimesroman">
        {mintState === MintState.AllowanceStep && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setAllowanceInProgress(true);
              sendAllowance();
            }}
            disabled={allowanceInProgress}
          >
            Step 1: Grant permission to transfer{" "}
            {displayValues.allowanceToCreate} {purchaseToken}
          </button>
        )}

        {mintState === MintState.MintStep && (
          <button
            className="btn btn-primary"
            onClick={() => {
              if (simulateData?.request) {
                setMintInProgress(true);
                writeContract(simulateData.request);
              }
            }}
            // TODO: Recheck allowance instead of assuming it's granted with allowanceTransactionResult
            // disabled={notEnoughTokensToMint || !simulateData?.request}
            disabled={!simulateData?.request}
          >
            Step 2: Mint BRGOV
          </button>
        )}

        {mintState === MintState.AllowanceTransactionInProgress && (
          <div className="mt-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
            <p className="text-2xl mt-2 font-bold">
              Granting {purchaseToken} allowance...
            </p>
          </div>
        )}

        {mintState === MintState.MintTransactionInProgress && (
          <div className="mt-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]" />
            <p className="text-2xl mt-2 font-bold">Minting BRGOV...</p>
          </div>
        )}

        {mintState === MintState.MintComplete && (
          <p className="text-2xl mt-2 font-bold">
            Mint complete.{" "}
            {mintTransactionUrl && (
              <span>
                Here is your{" "}
                <a
                  href={mintTransactionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  transaction
                </a>{" "}
                link.
              </span>
            )}
          </p>
        )}
      </div>
    </>
  );
}
