import { useAccount } from "wagmi";
import abi from "./abi.json";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useCookies } from 'react-cookie';

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
 * CodeOfEthicsContent React component.
 *
 */
export function CodeOfEthicsContent() {
  const [loading, setLoading] = useState(true);
  const [hasValidMembership, setHasValidMembership] = useState(false);
  const [cookies, setCookie] = useCookies([CONTRACT_ADDRESS]);

  const { address, isConnected, isConnecting } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log("Connected", { address, connector, isReconnected });
    },
  });

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
            let date = new Date();
            // 60 minutes
            date.setTime(date.getTime()+(3600*1000));
            //24 hours
            //date.setTime(date.getTime()+(86400*1000));
            setCookie(CONTRACT_ADDRESS, address, {
              path: '/',
              expires: date,
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
  }, [address, isConnected]);

  return (
    <>
      <div className="mt-4 font-newtimesroman">
        {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
        )}
        {loading && isConnecting && <p className="text-2xl mt-4">Loading...</p>}
      </div>

      {hasValidMembership && (
        <div className="m-4 mx-auto max-w-xl text-left font-newtimesroman">
          
          <h2 className="text-xl font-bold">Code Of Ethics</h2>
          <br />
          <ol className="max-w-md space-y-1 text-gray-600 list-decimal list-outside dark:text-gray-600 ">
            <li><b>Honesty:</b> We will be truthful and transparent in our actions and communications, and we will not deceive or mislead others.</li>

            <li><b>Fairness:</b> We will treat all community members with respect and fairness, and we will not discriminate on the basis of race, gender, religion, or any other factor.</li>

            <li><b>Integrity:</b> We will act with integrity and avoid conflicts of interest, and we will not use our positions for personal gain.</li>

            <li><b>Accountability:</b> We will be accountable for our actions and decisions, and we will take responsibility for any mistakes or failures.</li>

            <li><b>Responsibility:</b> We will act responsibly in our use of resources and in our impact on the environment, and we will work to create a sustainable community.</li>

            <li><b>Collaboration:</b> We will work collaboratively with other community members and organizations to achieve our goals, and we will respect and value diverse perspectives and opinions.</li>

            <li><b>Professionalism:</b> We will act in a professional manner, and we will maintain confidentiality and privacy as appropriate.</li>

            <li><b>Openness:</b> We will be open to feedback and criticism, and we will work to continuously improve our performance and effectiveness.</li>

            <li><b>Respect:</b> We will show respect for the law and for the democratic process, and we will work to build a community that is peaceful, just, and inclusive.</li>

            <li><b>Service:</b> We are dedicated and committed to serving the Bittrees Research community, and we strive to improve our organization to achieve the best possible outcomes for all of our members.</li>
          </ol>
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
