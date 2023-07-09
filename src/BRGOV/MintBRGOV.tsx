import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { goerli } from "wagmi/chains";
import abi from "./abi-brgov.json";
import btreeAbi from "./abi-btree.json";
import wbtcAbi from "./abi-wbtc.json";
import wbtcTestAbi from "./abi-wbtc-test.json";
import { useERC20TokenInformation } from "./useERC20TokenInformation";
import { useManageAllowanceTransaction } from "./useManageAllowanceTransaction";

const CONTRACT_ADDRESS = "0x14dBB93a78B5e89540e902d1E6Ee26C989e08ef0"; // goerli
const BTREE_CONTRACT_ADDRESS = "0x1Ca23BB7dca2BEa5F57552AE99C3A44fA7307B5f"; // goerli
// const BTREE_CONTRACT_ADDRESS = "0x6bDdE71Cf0C751EB6d5EdB8418e43D3d9427e436"; // mainnet
const WBTC_CONTRACT_ADDRESS = "0x26bE8Ef5aBf9109384856dD25ce1b4344aFd88b0"; // goerli
// const WBTC_CONTRACT_ADDRESS = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"; // mainnet

const chainId = goerli.id; //mainnet.id;

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
    [Denomination.One]: "0.001",
    [Denomination.Ten]: "0.01",
    [Denomination.Hundred]: "0.1",
  },
  [PurchaseToken.BTREE]: {
    [Denomination.One]: "1000",
    [Denomination.Ten]: "10000",
    [Denomination.Hundred]: "100000",
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
): string {
  return pricePerDenomination[purchaseToken][denomination];
}

export function MintBRGOV({ denomination, purchaseToken }: MintBRGOVProps) {
  const isBTREE = purchaseToken === PurchaseToken.BTREE;
  const mintPrice = ethers.utils
    .parseUnits(getMintPrice(denomination, purchaseToken), "ether") // TODO: Support 3 different certifcate types/prices
    .toBigInt();
  const currencySymbol = isBTREE ? "BTREE" : "WBTC";
  const denominationSymbol = `BRGOV-${denomination}`;

  const [mintCount, setMintcount] = useState(1);
  const [total, setTotal] = useState<bigint>(mintPrice);
  const { address } = useAccount();
  const [allowanceInProgress, setAllowanceInProgress] = useState(false);
  const [mintInProgress, setMintInProgress] = useState(false);
  const [mintComplete, setMintComplete] = useState(false);

  const { allowance, balance, isLoading } = useERC20TokenInformation({
    walletAddress: address,
    CONTRACT_ADDRESS,
    ERC20_CONTRACT_ADDRESS: isBTREE
      ? BTREE_CONTRACT_ADDRESS
      : WBTC_CONTRACT_ADDRESS,
  });

  function calcTotal(count: string) {
    setMintcount(parseInt(count, 10));
    const totalEther = mintPrice * BigInt(parseInt(count ? count : "0", 10));
    setTotal(totalEther);
  }

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: mintMethod[denomination],
    chainId,
    args: [
      isBTREE ? 0x0 : 0x1, // 0x0 is BTREE. 0x1 is WBTC.
      address,
      mintCount,
    ],
  });
  const { write } = useContractWrite(config);

  function onClick() {
    setMintInProgress(true);
    write?.();
    window.setTimeout(() => {
      setMintComplete(true);
    }, 10000);
  }

  const { sendAllowance, allowanceTransactionResult } =
    useManageAllowanceTransaction({
      ERC20_CONTRACT_ADDRESS: isBTREE
        ? BTREE_CONTRACT_ADDRESS
        : WBTC_CONTRACT_ADDRESS,
      erc20Abi: isBTREE
        ? btreeAbi
        : chainId === goerli.id
        ? wbtcTestAbi
        : wbtcAbi,
      erc20FunctionName: isBTREE
        ? "increaseAllowance"
        : chainId === goerli.id
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
    console.log(
      "refresh UI, transaction successful. allowanceTransactionResult:",
      allowanceTransactionResult,
      "plus",
      {
        allowance,
        total,
      }
    );
    setAllowanceInProgress(false);
  }, [allowanceTransactionResult, allowance, total]);

  const displayMintPrice = isBTREE
    ? parseInt(ethers.utils.formatEther(mintPrice), 10).toLocaleString()
    : ethers.utils.formatEther(mintPrice);
  const displayTotalPrice = isBTREE
    ? parseInt(ethers.utils.formatEther(total), 10).toLocaleString()
    : ethers.utils.formatEther(total);
  const displayErc20Balance = isBTREE
    ? parseInt(ethers.utils.formatEther(balance), 10).toLocaleString()
    : ethers.utils.formatEther(balance);
  const displayErc20Allowance = isBTREE
    ? parseInt(ethers.utils.formatEther(allowance), 10).toLocaleString()
    : ethers.utils.formatEther(allowance);
  const displayAllowanceToCreate = isBTREE
    ? parseInt(ethers.utils.formatEther(total - allowance), 10).toLocaleString()
    : ethers.utils.formatEther(total - allowance);

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
        {chainId === goerli.id && (
          <div className="text-2xl text-red-500 p-4">
            This site is on testnet. Real BRGOV tokens are not mintable yet.
          </div>
        )}
        <p className="text-2xl mt-4">Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <>
      {chainId === goerli.id && (
        <div className="text-2xl text-red-500 p-4">
          This site is on testnet. Real BRGOV tokens are not mintable yet.{" "}
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
            onChange={(e) => calcTotal(e.target.value)}
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
          Loading your {currencySymbol} holdings and allowance information...
        </div>
      )}
      {!isLoading && (
        <div className="mt-6 font-newtimesroman w-1/2 mx-auto">
          <p className="text-xl underline">Your {currencySymbol} Holdings</p>
          <p className="mt-2">
            Your {currencySymbol} holdings are {displayErc20Balance}.{" "}
            {notEnoughErc20ToMint && (
              <span className="font-bold text-red-500">
                Note that your wallet does not have enough {currencySymbol}{" "}
                tokens to mint {mintCount} BRGOV token{mintCount > 0 ? "s" : ""}
                .
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
          To transfer {currencySymbol} tokens, you'll need ETH in your wallet.
          There will also be two transactions. The first to grant permissions
          for our contract to transfer {currencySymbol} tokens on your behalf,
          the second to do the transfer and mint your equity tokens.
        </p>
      </div>

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
            disabled={
              !Boolean(write) ||
              notEnoughErc20ToMint ||
              mintInProgress ||
              mintComplete
            }
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
              Granting {currencySymbol} allowance. After you accept transaction,
              soon this button will change to the Mint BRGOV step once allowance
              has completed...
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
            Mint should now be complete.
          </p>
        )}
      </div>
    </>
  );
}
