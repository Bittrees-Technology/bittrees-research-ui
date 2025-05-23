import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { hasActiveMembership, CONTRACT_ADDRESS } from "./alchemy";

/**
 * MembersContent React component.
 *
 */
export function MembersContent() {
  const [loading, setLoading] = useState(true);
  const [hasValidMembership, setHasValidMembership] = useState(false);
  const [cookies, setCookie] = useCookies([CONTRACT_ADDRESS]);

  const { address, isConnected, isConnecting } = useAccount();

  useEffect(() => {
    let token = cookies[CONTRACT_ADDRESS];
    if (!token) {
      console.log("isConnected: " + isConnected);
      if (!(address && isConnected)) {
        setHasValidMembership(false);
        return;
      }

      hasActiveMembership(address)
        .then((hasActiveMembership) => {
          if (hasActiveMembership) {
            setCookie(CONTRACT_ADDRESS, address, {
              path: "/",
            });
          }
          setHasValidMembership(hasActiveMembership);
        })
        .catch((err) => {
          console.error(err);
          setHasValidMembership(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setHasValidMembership(true);
      setLoading(false);
    }
  }, [address, isConnected, cookies, setCookie]);

  return (
    <>
      <div className="mt-4 font-newtimesroman">
        {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
        )}
        {loading && isConnecting && <p className="text-2xl mt-4">Loading...</p>}
      </div>

      {hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl">
          <h2 className="text-xl font-newtimesroman font-bold">
            Member Services
          </h2>
          <br />
          <div className="grid grid-cols-2 gap-6">
            <div className="text-left font-newtimesroman">
              <ul className="max-w-md space-y-1 text-gray-400 list-disc list-outside ms-4 dark:text-gray-400 ">
                <li className="p-2">Gift Membership</li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://etherscan.io/token/0xc8121e650bd797d8b9dad00227a9a77ef603a84a#code"
                  >
                    Membership Contract
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    href="/mint-bnote"
                  >
                    Mint BNOTE (Bittrees Research Preferred Stock)
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://etherscan.io/token/0x1a8b6b0f57876f5a1a17539c25f9e4235cf7060c#code"
                  >
                    BRGOV Contract (on Ethereum){" "}
                  </a>
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://basescan.org/token/0xCa6f24a651bc4Ab545661a41a81EF387086a34C2#code"
                  >
                    BRGOV Contract (on Base)
                  </a>
                </li>

                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://metaforo.io/g/bittreesresearch"
                  >
                    Governance Forum
                  </a>
                </li>

                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://snapshot.box/#/s:research.bittrees.eth"
                  >
                    Snapshot
                  </a>
                </li>

                <li className="p-2">BIT Maker</li>
                <li className="p-2">BIT Farmer</li>
              </ul>
            </div>
            <div className="text-left font-newtimesroman">
              <ul className="max-w-md space-y-1 text-gray-400 list-disc list-outside ms-4 dark:text-gray-400 ">
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    href="/visionstatement"
                  >
                    Vision Statement
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    href="/codeofethics"
                  >
                    Code of Ethics
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.google.com/document/d/1ncY1zhrYFzpAh9hrSqCmO6z3dftXTfWV1RXHGHrTwlQ/edit"
                  >
                    Roadmap
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.google.com/drawings/d/1_AYqj8boh7o8d_CrhSbSUtlvrs0fpTOUEIOxqGd_s58/"
                  >
                    Org Chart Diagram
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://guild.xyz/bittrees-research"
                  >
                    Telegram
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://twitter.com/bresearch_"
                  >
                    Twitter
                  </a>
                </li>
                <li className="p-2">
                  <a
                    className="text-black no-underline hover:underline hover:text-green-700"
                    target="_blank"
                    rel="noreferrer"
                    href="https://paragraph.xyz/@bittrees_research"
                  >
                    Paragraph
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl font-newtimesroman">
          <a href="/mint">Please go mint your membership!</a>
        </div>
      )}
    </>
  );
}
