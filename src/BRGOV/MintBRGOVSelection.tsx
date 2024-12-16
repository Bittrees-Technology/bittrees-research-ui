import { useState } from "react";
import { useChainId } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Denomination, MintBRGOV, PurchaseToken } from "./MintBRGOV";

export function MintBRGOVSelection({
  onChangeDenomination,
}: {
  onChangeDenomination: (denomination: Denomination) => void;
}) {
  const [denomination, setDenomination] = useState<Denomination>(
    Denomination.One
  );
  const [purchaseToken, setPurchaseToken] = useState<PurchaseToken>(
    PurchaseToken.WBTC
  );
  const [next, setNext] = useState(false);

  const chainId = useChainId();

  return (
    <>
      {next && (
        <MintBRGOV denomination={denomination} purchaseToken={purchaseToken} />
      )}
      {!next && (
        <div className="flex flex-col items-center">
          <div className="px-4 md:px-28 text-justify font-newtimesroman">
            <p>
              We offer three different certificate denominations: one, ten and a
              hundred. This helps save you gas fees. For example instead of
              minting 1,000 single certificates, you can mint 10 of the hundred
              denomination instead.
            </p>
            <p className="mt-4">
              When you mint in the next step, you'll be able to select a
              quantity for your choosen denomination.
            </p>
            <hr className="mt-4" />
          </div>
          <div className="grid grid-cols-2 gap-6 justify-start font-newtimesroman mt-4">
            <div className="text-right">
              Please choose certificate denomination:
            </div>
            <div className="text-left">
              <select
                className="border-2"
                onChange={(event) => {
                  setDenomination(event.target.value as Denomination);
                  onChangeDenomination(event.target.value as Denomination);
                }}
              >
                <option value={Denomination.One}>One</option>
                <option value={Denomination.Ten}>Ten</option>
                <option value={Denomination.Hundred}>Hundred</option>
              </select>
            </div>
            <div className="text-right">Please choose token for purchase:</div>
            <div className="text-left">
              <select
                className="border-2"
                onChange={(event) => {
                  setPurchaseToken(event.target.value as PurchaseToken);
                }}
              >
                <option value={PurchaseToken.WBTC}>
                  {chainId === mainnet.id ? "WBTC" : "cbBTC"}
                </option>
                <option value={PurchaseToken.BTREE}>BTREE</option>
              </select>
            </div>
          </div>
          <div className="text-left mt-8">
            <button
              className="btn btn-primary"
              onClick={() => {
                setNext(true);
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
