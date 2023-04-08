import { useAccount } from "wagmi";
import abi from "./abi.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = "0xc8121e650bd797d8b9dad00227a9a77ef603a84a";
const RPC_URL =
  "https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN";

interface OwnedNFT {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
  };
}

/**
 * Checks if a membership is expired on a single token.
 *
 * @param tokenId - hex string such as 0x01
 * @returns boolean
 */
async function isMembershipExpired(tokenId: string): Promise<boolean> {
  const provider = await new ethers.providers.JsonRpcProvider(RPC_URL);
  const contract = await new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
  return contract.isExpired(tokenId);
}

/**
 * Gets all tokenIds for a given wallet address that are owned by the contract.
 *
 * @param ownerAddress - wallet address
 * @param contractAddress
 * @returns string[] - array of tokenIds
 */
async function getMemberTokenIds(
  ownerAddress: string,
  contractAddress: string
): Promise<string[]> {
  const alchemyEndpoint = `${RPC_URL}/getNFTs/?owner=${ownerAddress}`;
  const response = await fetch(alchemyEndpoint);
  const data = await response.json();
  const ownedNfts = data.ownedNfts as OwnedNFT[];
  const contractNfts = ownedNfts.filter((nft) => {
    return nft.contract.address === contractAddress;
  });
  return contractNfts.map((nft) => {
    return nft.id.tokenId;
  });
}

/**
 * Checks if a wallet address has an active membership.
 *
 * @param ownerAddress
 * @returns boolean
 */
async function hasActiveMembership(ownerAddress: string): Promise<boolean> {
  const tokenIds = await getMemberTokenIds(ownerAddress, CONTRACT_ADDRESS);
  console.log("tokenId: " + tokenIds)
  const isExpired = await Promise.all(
    tokenIds.map((tokenId) => {
      return isMembershipExpired(tokenId);
    })
  );
  console.log("isExpired: " + isExpired)
  return isExpired.some((isExpired) => {
    return !isExpired;
  });
}

/**
 * MembersContent React component.
 *
 */
export function MembersContent() {
  const [loading, setLoading] = useState(true);
  const [hasValidMembership, setHasValidMembership] = useState(false);

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setHasValidMembership(false);
      return;
    }

    hasActiveMembership(address)
      .then((hasActiveMembership) => {
        setHasValidMembership(hasActiveMembership);
      })
      .catch((err) => {
        console.error(err);
        setHasValidMembership(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  return (
    <>
      <div className="mt-4">
        {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
        )}
        {loading && (
          <p className="text-2xl mt-4">Loading...</p>
        )}
      </div>

      {hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl">
          Member Services
          <br />
          <br />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <ul>
                <li>Vision Statement</li>
                <li><a href="/codeofethics">Code of Ethics</a></li>
                <li>Gift Membership </li>
                <li>Mint Equity </li>
                <li>Equity Contract </li>
                <li>Membership Contract</li>
              </ul>

            </div>
            <div>
              <ul>
                <li><a href="/roadmap">Roadmap</a></li>
                <li><a href="https://docs.google.com/drawings/d/1_AYqj8boh7o8d_CrhSbSUtlvrs0fpTOUEIOxqGd_s58/">Org Chart Diagram</a></li>
                <li>Telegram</li>
                <li><a href="https://twitter.com/BittreesR">Twitter</a></li>
                <li><a href="https://paragraph.xyz/@bittrees_research">Paragraph</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl">
          <a href="/mint">Please go mint your membership!</a>
        </div>
      )}
    </>
  );
}
