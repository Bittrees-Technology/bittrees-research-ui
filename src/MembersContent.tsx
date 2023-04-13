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
 * MembersContent React component.
 *
 */
export function MembersContent() {
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
        <div className="m-4 mx-auto max-w-xl">
          <h2 className="text-xl font-newtimesroman font-bold">Member Services</h2>
          <br />
          <div className="grid grid-cols-2 gap-6">
            <div className="text-left font-newtimesroman">
              <ul className="max-w-md space-y-1 text-gray-400 list-disc list-inside dark:text-gray-400 ">
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    href="/visionstatement">Vision Statement</a>
                </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    href="/codeofethics">Code of Ethics</a>
                </li>
                <li>Gift Membership </li>
                <li>Mint Equity </li>
                <li>Equity Contract </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://etherscan.io/token/0xc8121e650bd797d8b9dad00227a9a77ef603a84a">
                    Membership Contract
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-left font-newtimesroman">
              
            <ul className="max-w-md space-y-1 text-gray-400 list-disc list-inside dark:text-gray-400 ">
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://docs.google.com/document/d/1ncY1zhrYFzpAh9hrSqCmO6z3dftXTfWV1RXHGHrTwlQ/edit">
                    Roadmap
                  </a>  
                </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://docs.google.com/drawings/d/1_AYqj8boh7o8d_CrhSbSUtlvrs0fpTOUEIOxqGd_s58/">
                    Org Chart Diagram
                  </a>
                </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://guild.xyz/bittrees-research">
                    Telegram
                  </a>
                </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://twitter.com/BittreesR">Twitter</a>
                </li>
                <li>
                  <a className="text-black no-underline hover:underline hover:text-green-700" 
                    target="_blank" 
                    rel="noreferrer"
                    href="https://paragraph.xyz/@bittrees_research">
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
