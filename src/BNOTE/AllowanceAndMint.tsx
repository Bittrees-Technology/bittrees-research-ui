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
}: {
  walletBalance: bigint;
  totalCertificates: number;
  bnoteContractAddress: Address;
  erc20PaymentToken: PaymentToken;
  userWalletAddress: Address;
  chainId: number;
}) {
  const [allowanceInProgress, setAllowanceInProgress] = useState(false);

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

  const { mintIt, isSuccessfulMint, txData, isReadyToMint } = useMint({
    bnoteContractAddress,
    paymentToken: erc20PaymentToken,
    totalCertificates,
  });

  const handleMint = useCallback(() => {
    mintIt();
  }, [mintIt]);

  useEffect(() => {
    console.log("Mint results:", { isSuccessfulMint, txData });
  }, [isSuccessfulMint, txData]);

  useEffect(() => {
    console.log("Allowance transaction result:", allowanceTransactionResult);
    setAllowanceInProgress(false);
    if (allowanceTransactionResult?.status === "success") {
      console.log("Allowance transaction successful");
      if (isReadyToMint) {
        handleMint();
      } else {
        console.log("Minting is not ready");
      }
    }
  }, [allowanceTransactionResult, handleMint, isReadyToMint, mintIt]);

  const needAllowance = amountOfAllowanceNeededWei > BigInt(0);
  const notEnoughTokensToMint = balanceWei < totalPriceWei;
  const enableMintButton =
    !allowanceInProgress && totalCertificates > 0 && walletBalance > BigInt(0);

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
          if (needAllowance) {
            setAllowanceInProgress(true);
            sendAllowance();
          } else {
            if (isReadyToMint) {
              handleMint();
            } else {
              console.log("Minting is not ready");
            }
          }
        }}
        disabled={!enableMintButton}
      >
        Mint
      </button>
      ;
    </div>
  );
}
