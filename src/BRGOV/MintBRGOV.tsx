import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useSimulateContract, useWriteContract } from "wagmi";
import { baseSepolia, mainnet } from "wagmi/chains";
import abi from "./abi-brgov.json";
import btreeAbi from "./abi-btree.json";
import wbtcTestAbi from "./abi-wbtc-test.json";
import wbtcAbi from "./abi-wbtc.json";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
import { useManageAllowanceTransaction } from "./useManageAllowanceTransaction";

const USE_MAINNET = true;

let CONTRACT_ADDRESS: `0x${string}`;
let BTREE_CONTRACT_ADDRESS: `0x${string}`;
let WBTC_CONTRACT_ADDRESS: `0x${string}`;

if (USE_MAINNET) {
  CONTRACT_ADDRESS = "0x1a8b6b0f57876f5a1a17539c25f9e4235cf7060c";
  BTREE_CONTRACT_ADDRESS = "0x6bDdE71Cf0C751EB6d5EdB8418e43D3d9427e436";
  WBTC_CONTRACT_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
} else {
  CONTRACT_ADDRESS = "0x14dBB93a78B5e89540e902d1E6Ee26C989e08ef0";
  BTREE_CONTRACT_ADDRESS = "0x1Ca23BB7dca2BEa5F57552AE99C3A44fA7307B5f";
  WBTC_CONTRACT_ADDRESS = "0x26bE8Ef5aBf9109384856dD25ce1b4344aFd88b0";
}

let chainId: number;
if (USE_MAINNET) {
  chainId = mainnet.id;
} else {
  chainId = baseSepolia.id;
}

const isTestnet = chainId === (baseSepolia.id as number);
const showTestnetWarning = false;

console.info(`BRGOV contract: ${CONTRACT_ADDRESS}`);
console.info(`BTREE contract: ${BTREE_CONTRACT_ADDRESS}`);
console.info(`WBTC contract: ${WBTC_CONTRACT_ADDRESS}`);
console.info(`Chain ID: ${chainId}`);

enum MintState {
  NotConnected,
  AllowanceStep,
  AllowanceTransactionInProgress,
  MintStep,
  MintTransactionInProgress,
  MintComplete,
}

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

const pricePerDenomination = {
  [PurchaseToken.WBTC]: {
    [Denomination.One]: BigInt("1") * BigInt(10 ** 5), // 0.001 WBTC
    [Denomination.Ten]: BigInt("10") * BigInt(10 ** 5), // 0.01 WBTC
    [Denomination.Hundred]: BigInt("100") * BigInt(10 ** 5), // 0.1 WBTC,
  },
  [PurchaseToken.BTREE]: {
    [Denomination.One]: BigInt(1000) * BigInt(10 ** 18), // 1000 BTREE
    [Denomination.Ten]: BigInt(10000) * BigInt(10 ** 18),
    [Denomination.Hundred]: BigInt(100000) * BigInt(10 ** 18),
  },
};

const mintMethod = {
  [Denomination.One]: "mint",
  [Denomination.Ten]: "mintTen",
  [Denomination.Hundred]: "mintHundred",
};

function getMintPrice(
  denomination: Denomination,
  purchaseToken: PurchaseToken
): bigint {
  return pricePerDenomination[purchaseToken][denomination];
}

export function MintBRGOV({ denomination, purchaseToken }: MintBRGOVProps) {
  const isBTREE = purchaseToken === PurchaseToken.BTREE;
  const mintPrice = getMintPrice(denomination, purchaseToken);

  const currencySymbol = isBTREE ? "BTREE" : "WBTC";
  const denominationSymbol = `BRGOV-${denomination}`;

  const [mintCount, setMintcount] = useState(1);
  const [total, setTotal] = useState<bigint>(mintPrice);
  const { address } = useAccount();
  const [allowanceInProgress, setAllowanceInProgress] = useState(false);
  const [mintInProgress, setMintInProgress] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);
  const [mintTransactionUrl, setMintTransactionUrl] = useState("");

  const { allowance, balance, isLoading } = useERC20TokenInformation({
    walletAddress: address,
    CONTRACT_ADDRESS,
    ERC20_CONTRACT_ADDRESS: isBTREE
      ? BTREE_CONTRACT_ADDRESS
      : WBTC_CONTRACT_ADDRESS,
  });

  function calcTotal(isBTREE: boolean, count: string) {
    setMintcount(parseInt(count, 10));
    const total = mintPrice * BigInt(parseInt(count ? count : "0", 10));
    isBTREE ? roundBTREE(total) : roundWBTC(total);
    setTotal(total);
  }

  const { data: simulateData } = useSimulateContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: mintMethod[denomination],
    args: [isBTREE ? 0x0 : 0x1, address, BigInt(mintCount)],
    chainId,
  });

  // Then use the writeContract hook
  const { writeContract, data, isError, error, isSuccess } = useWriteContract();

  useEffect(() => {
    console.log("MINT status", { isSuccess, data });
    if (isSuccess) {
      setMintComplete(true);
      if (data) {
        // data is now just the transaction hash
        setMintTransactionUrl(
          `https://${USE_MAINNET ? "" : "basesepolia."}etherscan.io/tx/${data}`
        );
      }
    }
    if (isError) {
      console.error("Minting error", error?.message);
    }
  }, [isSuccess, data, isError, error]);

  function onClick() {
    if (!simulateData?.request) return;
    setMintInProgress(true);
    writeContract(simulateData.request);
  }

  const { sendAllowance, allowanceTransactionResult } =
    useManageAllowanceTransaction({
      ERC20_CONTRACT_ADDRESS: isBTREE
        ? BTREE_CONTRACT_ADDRESS
        : WBTC_CONTRACT_ADDRESS,
      erc20Abi: isBTREE ? btreeAbi : isTestnet ? wbtcTestAbi : wbtcAbi,
      erc20FunctionName: isBTREE
        ? "increaseAllowance"
        : isTestnet
        ? "increaseAllowance"
        : "increaseApproval",
      CONTRACT_ADDRESS,
      chainId,
      amount: total - allowance < 0 ? BigInt(0) : total - allowance,
    });

  function onClickAllowance() {
    setAllowanceInProgress(true);
    sendAllowance();
  }

  useEffect(() => {
    setAllowanceInProgress(false);
  }, [allowanceTransactionResult, allowance, total]);

  function roundBTREE(value: bigint) {
    return parseInt(ethers.utils.formatEther(value), 10).toLocaleString();
  }

  function roundWBTC(value: bigint) {
    return (
      Math.round(parseFloat(ethers.utils.formatUnits(value, 8)) * 10000) / 10000
    );
  }

  const displayMintPrice = isBTREE
    ? roundBTREE(mintPrice)
    : roundWBTC(mintPrice);
  const displayTotalPrice = isBTREE ? roundBTREE(total) : roundWBTC(total);
  const displayErc20Balance = isBTREE
    ? roundBTREE(balance)
    : roundWBTC(balance);
  const displayErc20Allowance = isBTREE
    ? roundBTREE(allowance)
    : roundWBTC(allowance);
  const displayAllowanceToCreate = isBTREE
    ? roundBTREE(total - allowance)
    : roundWBTC(total - allowance);

  const enoughAllowanceToMint = Boolean(allowance >= total);
  const notEnoughErc20ToMint = Boolean(balance < total);

  let mintState = MintState.NotConnected;
  if (address) {
    if (mintComplete) {
      mintState = MintState.MintComplete;
    } else if (allowanceInProgress) {
      mintState = MintState.AllowanceTransactionInProgress;
    } else if (mintInProgress) {
      mintState = MintState.MintTransactionInProgress;
    } else if (enoughAllowanceToMint || allowanceTransactionResult) {
      mintState = MintState.MintStep;
    } else {
      mintState = MintState.AllowanceStep;
    }
  }

  if (mintState === MintState.NotConnected) {
    return (
      <div>
        {showTestnetWarning && (
          <div className="text-2xl text-red-500 p-4">
            This site is being tested. BRGOV tokens are not mintable yet.
          </div>
        )}
        <p className="text-2xl mt-4">Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <>
      {mintState !== MintState.MintComplete && (
        <div>
          {showTestnetWarning && (
            <div className="text-2xl text-red-500 p-4">
              This site is being tested. BRGOV tokens are not mintable yet.
            </div>
          )}
          <div className="grid grid-cols-2 gap-6 justify-start font-newtimesroman">
            <div className="text-right">Certificate Denomination:</div>
            <div className="text-left">{denominationSymbol}</div>
            <div className="text-right">Cost per BRGOV token:</div>
            <div className="text-left">
              {displayMintPrice} {currencySymbol}
            </div>
            <div className="text-right">Number of tokens to mint:</div>
            <div className="text-left">
              <input
                className="w-20 input-sm"
                type="number"
                onChange={(e) => calcTotal(isBTREE, e.target.value)}
                step="1"
                min="1"
                value={mintCount}
              />
            </div>
            <div className="text-right">Total price:</div>
            <div className="text-left">
              {displayTotalPrice} <span>{currencySymbol}</span>
            </div>
          </div>
          {isLoading && (
            <div className="mt-2 font-newtimesroman">
              Loading your {currencySymbol} holdings and allowance
              information...
            </div>
          )}
          {!isLoading && (
            <div className="mt-6 font-newtimesroman w-1/2 mx-auto">
              <p className="text-xl underline">
                Your {currencySymbol} Holdings
              </p>
              <p className="mt-2">
                Your {currencySymbol} holdings are {displayErc20Balance}.{" "}
                {notEnoughErc20ToMint && (
                  <span className="font-bold text-red-500">
                    Note that your wallet does not have enough {currencySymbol}{" "}
                    tokens to mint {mintCount} BRGOV token
                    {mintCount > 0 ? "s" : ""}.
                  </span>
                )}
              </p>
              <p className="mt-2">
                The allowance of {currencySymbol} you've granted for minting is{" "}
                {displayErc20Allowance}.
              </p>
            </div>
          )}

          <div className="m-4 mt-8 mx-auto max-w-xl font-newtimesroman">
            <p className="text-xl underline">What's required for minting?</p>
            <p className="mt-2">
              To transfer {currencySymbol} tokens, you'll need ETH in your
              wallet. There will also be two transactions. The first to grant
              permissions for our contract to transfer {currencySymbol} tokens
              on your behalf, the second to do the transfer and mint your equity
              tokens.
            </p>
          </div>
        </div>
      )}

      {/* only display error if there is enough btree, but something else went wrong */}
      {/* {mintState === MintState.MintStep && error && !notEnoughErc20ToMint && (
        <div className="m-4 mx-auto max-w-xl font-newtimesroman font-bold text-lg text-red-500">
          An error occurred preparing the transaction:{" "}
          {displayFriendlyError(error.message)}
        </div>
      )} */}

      <div className="mt-4 font-newtimesroman">
        {mintState === MintState.AllowanceStep && (
          <button
            className="btn btn-primary"
            onClick={onClickAllowance}
            // disabled={dataForAllowanceTransaction}
          >
            Step 1: Grant permission to transfer {displayAllowanceToCreate}{" "}
            {currencySymbol}
          </button>
        )}

        {mintState === MintState.MintStep && (
          <button
            className="btn btn-primary"
            onClick={onClick}
            disabled={notEnoughErc20ToMint || mintInProgress || mintComplete}
          >
            Step 2: Mint BRGOV
          </button>
        )}

        {mintState === MintState.AllowanceTransactionInProgress && (
          <div className="mt-4">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="text-2xl mt-2 font-bold">
              Granting {currencySymbol} allowance, this may take a couple of
              minutes. After wallet pops up and you accept transaction, this
              button will eventually change to the "Mint BRGOV" step once
              allowance has completed...
            </p>
          </div>
        )}

        {mintState === MintState.MintTransactionInProgress && (
          <div className="mt-4">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="text-2xl mt-2 font-bold">
              Minting BRGOV. After wallet pops up and you accept transaction,
              please be patient while minting...
            </p>
          </div>
        )}

        {mintState === MintState.MintComplete && (
          <p className="text-2xl mt-2 font-bold">
            Mint complete.{" "}
            {mintTransactionUrl && (
              <span>
                Here is your
                <a href={mintTransactionUrl}>transaction</a> link.
              </span>
            )}
          </p>
        )}
      </div>
    </>
  );
}
