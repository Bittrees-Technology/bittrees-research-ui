import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import { useManageAllowanceTransaction } from "./useManageAllowanceTransaction";
import { useMint } from "./useMint";
import { useMintingInfo } from "./useMintingInfo";
import { PaymentToken } from "./usePaymentTokenInformation";

export function AllowanceAndMint({
  walletBalance,
  totalCertificates,
  bnoteContractAddress,
  erc20PaymentToken,
  userWalletAddress,
  chainId,
  explorerDomain,
}: {
  walletBalance: bigint;
  totalCertificates: number;
  bnoteContractAddress: Address;
  erc20PaymentToken: PaymentToken;
  userWalletAddress: Address;
  chainId: number;
  explorerDomain: string;
}) {
  const [allowanceInProgress, setAllowanceInProgress] = useState(false);
  const [allowanceSuccessful, setAllowanceSuccessful] = useState(false);
  const [mintInProgress, setMintInProgress] = useState(false);
  const [mintButtonPressed, setMintButtonPressed] = useState(false);
  const [mintCompleted, setMintCompleted] = useState(false);

  const {
    displayValues,
    totalPriceWei,
    balanceWei,
    amountOfAllowanceNeededWei,
  } = useMintingInfo({
    totalCertificates,
    bnoteContractAddress,
    erc20PaymentToken,
    userWalletAddress,
  });

  const { sendAllowance, allowanceTransactionResult } =
    useManageAllowanceTransaction({
      erc20ContractAddress: erc20PaymentToken.address,
      erc20FunctionName: "increaseAllowance", // TODO: Handle approveAllowance for WBTC
      contractAddress: bnoteContractAddress,
      amount: amountOfAllowanceNeededWei,
      chainId,
    });

  const { mintIt, isSuccessfulMint, txData } = useMint({
    bnoteContractAddress,
    paymentToken: erc20PaymentToken,
    totalCertificates,
  });

  const handleMint = useCallback(() => {
    mintIt();
  }, [mintIt]);

  useEffect(() => {
    console.log("Allowance transaction result:", allowanceTransactionResult);
    setAllowanceInProgress(false);
    if (allowanceTransactionResult?.status === "success") {
      console.log("Allowance transaction successful");
      setAllowanceSuccessful(true);
    }
  }, [allowanceSuccessful, allowanceTransactionResult, mintIt]);

  useEffect(() => {
    console.log("XXX", {
      allowanceSuccessful,
      isSuccessfulMint,
      mintInProgress,
    });
    if (
      allowanceSuccessful &&
      !isSuccessfulMint &&
      !mintInProgress &&
      mintButtonPressed
    ) {
      console.log("CALLING MINT!!!");
      setMintInProgress(true);
      handleMint();
    }
  }, [
    allowanceSuccessful,
    mintIt,
    isSuccessfulMint,
    handleMint,
    mintInProgress,
    mintButtonPressed,
  ]);

  useEffect(() => {
    console.log("Mint results:", { isSuccessfulMint, txData });
    if (isSuccessfulMint) {
      // setMintInProgress(false);
      // setMintButtonPressed(false);
      console.log("Mint transaction successful");
      setMintCompleted(true);
    }
  }, [isSuccessfulMint, txData]);

  const needAllowance = amountOfAllowanceNeededWei > BigInt(0);
  const notEnoughTokensToMint = balanceWei < totalPriceWei;
  const enableMintButton =
    !allowanceInProgress &&
    !mintInProgress &&
    totalCertificates > 0 &&
    walletBalance > BigInt(0);

  useEffect(() => {
    if (!needAllowance) {
      console.log("AAA No allowance needed");
      setAllowanceSuccessful(true);
    } else {
      console.log("AAA Allowance needed");
      setAllowanceSuccessful(false);
    }
  }, [needAllowance]);

  useEffect(() => {
    console.log("txData", txData);
  }, [txData]);

  return (
    <div>
      <div className="mt-6 w-1/2 mx-auto">
        <p className="text-xl underline">
          Your {erc20PaymentToken.name} Holdings
        </p>
        <p className="mt-2">
          Your {erc20PaymentToken.name} holdings are {displayValues.balance}.{" "}
          {notEnoughTokensToMint && (
            <span className="font-bold text-red-500">
              Note that your wallet does not have enough{" "}
              {erc20PaymentToken.name} tokens to mint {totalCertificates} BNOTE
              token
              {totalCertificates > 1 ? "s" : ""}.
            </span>
          )}
        </p>
        <p className="mt-2">
          The allowance of {erc20PaymentToken.name} you've granted for minting
          is {displayValues.allowance}.
        </p>
      </div>
      <div className="m-4 mt-8 mx-auto max-w-xl">
        <p className="text-xl underline">What's required for minting?</p>
        <ol className="list-decimal list-inside mt-2">
          <li>
            To transfer {erc20PaymentToken.name} tokens, you'll need ETH in your
            wallet.
          </li>
          <li>
            {needAllowance && (
              <span>
                There will be two transactions. The first to grant permissions
                for our contract to transfer {erc20PaymentToken.name} tokens on
                your behalf, the second to do the transfer and mint your equity
                tokens.
              </span>
            )}
            {!needAllowance && (
              <span>
                <span>
                  There will be one transaction to mint your equity tokens,
                  since you have already granted permissions for our contract to
                  transfer {erc20PaymentToken.name} tokens on your behalf.
                </span>
              </span>
            )}
          </li>
        </ol>
      </div>
      {allowanceInProgress && <div>Allowance in-progress</div>}
      <button
        className="disabled:italic disabled:text-gray-300 border w-full bg-secondary enabled:hover:bg-secondary/90 font-semibold text-lg py-4 px-6 rounded-md transition-all enabled:hover:-translate-y-0.5"
        onClick={() => {
          setMintButtonPressed(true);
          if (needAllowance) {
            setAllowanceInProgress(true);
            sendAllowance();
          }
        }}
        disabled={!enableMintButton}
      >
        Mint
      </button>
      {mintCompleted && (
        <div className="mt-4">
          <p className="text-lg font-semibold text-primary mb-3">
            Minting completed!
          </p>
          <p>
            Your transaction has been successfully completed. You can view it{" "}
            <a
              href={`https://${explorerDomain}/tx/${txData}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {`https://${explorerDomain}/tx/${txData}`}
            </a>
            .
          </p>
          <p className="mt-2">
            You can now view your BNOTE tokens in your wallet.
          </p>
        </div>
      )}
    </div>
  );
}
