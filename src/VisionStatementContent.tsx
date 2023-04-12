import { useAccount } from "wagmi";
import abi from "./abi.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";

const CONTRACT_ADDRESS = "0xc8121e650bd797d8b9dad00227a9a77ef603a84a";
const RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN";

/*
interface OwnedNFT {
  contract: {
    address: string;
  };
  id: {
    tokenId: string;
  };
}
*/

interface MyNFT {
  tokenId: string;
}

/**
 * Checks if a membership is expired on a single token.
 *
 * @param tokenId - hex string such as 0x01
 * @returns boolean
 */
async function isMembershipExpired(tokenId: string): Promise<boolean> {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
    return await contract.isExpired(tokenId);
  } catch (err) {
    console.error("failure when calling contract.isExpired() due to", err);
  }
  return false;
}

/**
 * Gets all tokenIds for a given wallet address that are owned by the contract.
 *
 * @param ownerAddress - wallet address
 * @param contractAddress
 * @returns string[] - array of tokenIds
 */
async function getMemberTokenIdsViaAlchemySDK(
  ownerAddress: string,
  contractAddress: string
): Promise<string[]> {  
  const settings = {
    apiKey: "g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN", 
    network: Network.ETH_MAINNET, 
  };
  const alchemy = new Alchemy(settings);
  const response = await alchemy.nft.getNftsForOwner( ownerAddress, { contractAddresses: [ contractAddress ] });
  const ownedNfts = response.ownedNfts as MyNFT[];
  return ownedNfts.map((nft) => {
    return nft.tokenId;
  });
}

/**
 * Gets all tokenIds for a given wallet address that are owned by the contract.
 *
 * @param ownerAddress - wallet address
 * @param contractAddress
 * @returns string[] - array of tokenIds
 */
/*
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
*/

/**
 * Checks if a wallet address has an active membership.
 *
 * @param ownerAddress
 * @returns boolean
 */
async function hasActiveMembership(ownerAddress: string): Promise<boolean> {
  //const tokenIds = await getMemberTokenIds(ownerAddress, CONTRACT_ADDRESS);
  const tokenIds = await getMemberTokenIdsViaAlchemySDK(ownerAddress, CONTRACT_ADDRESS);
  console.log("tokenId: " + tokenIds);
  const isExpired = await Promise.all(
    tokenIds.map((tokenId) => {
      return isMembershipExpired(tokenId);
    })
  );
  console.log("isExpired: " + isExpired);
  return isExpired.some((isExpired) => {
    return !isExpired;
  });
}

/**
 * VisionStatementContent React component.
 *
 */
export function VisionStatementContent() {
  const [loading, setLoading] = useState(true);
  const [hasValidMembership, setHasValidMembership] = useState(false);

  const { address, isConnected, isConnecting } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
  });

  useEffect(() => {
    console.log("isConnected: " + isConnected);
    if (!(address && isConnected)) {
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
  }, [address, isConnected]);

  return (
    <>
      <div className="mt-4">
        {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
        )}
        {loading && isConnecting && <p className="text-2xl mt-4">Loading...</p>}
      </div>

      {hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-left">Vision Statement</h2>
          <br />
          <div className="text-l font-kalam text-left">
            Dear reader,
            <br/><br/>
            At Bittrees Research, we are a purpose-driven organization that exists to advance society towards a more just and equitable future by funding public goods and promoting research in emerging technologies and systems innovation. We recognize the importance of historical and contextual relevance in our work, and strive to create new knowledge, tools, and systems that have a positive impact in the metaverse and beyond.
            <br/><br/>
            Our organization is made up of a diverse group of individuals who are passionate about using their expertise and resources to create a better world. We bring together researchers, innovators, creatives, and community members to collaborate on cutting-edge projects that contribute to our shared vision of a more equitable and sustainable society.
            <br/><br/>
            Our goals are to generate insights that can inform policy, strategy, and decision-making processes, to fund public goods that benefit humankind, and to foster innovation with a human-centric focus. We are committed to staying true to our values of transparency, accountability, and community-driven decision making in all aspects of our work.
            <br/><br/>
            If you share our vision and want to be a part of this important work, we invite you to join us. Together, we can make a meaningful difference in the world.
            <br/><br/>
            Thanks,<br/>
            Jonathan
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
