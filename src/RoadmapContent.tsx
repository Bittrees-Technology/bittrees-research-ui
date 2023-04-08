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
  const isExpired = await Promise.all(
    tokenIds.map((tokenId) => {
      return isMembershipExpired(tokenId);
    })
  );
  return isExpired.some((isExpired) => {
    return !isExpired;
  });
}

/**
 * MembersContent React component.
 *
 */
export function RoadmapContent() {
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
          
          <ul>
            <li>Organization: BR</li>
            <ul>
              <li>Roadmap</li>
              <ul>
                <li>Alpha</li>
                <ul>
                  <li>Main Landing Page</li>
                  <li>Membership mint page [term membership framework]</li>
                  <li>Assign governors to escrow</li>
                  <li>Open minting</li>
                  <li>Virtual lodge</li>
                  <li>Private telegram</li>
                  <li>Gitbook</li>
                </ul>
                <li>Beta</li>
                <ul>
                  <li>Member Services landing page</li>
                  <li>Offer Equity NFTs to members</li>
                  <li>Offer Trust deployer as LOI</li>
                  <li>Offer the Term membership framework [SAAS product]</li>
                  <li>Elect Representative members</li>
                  <li>Assign Executive members</li>
                </ul>
                <li>Launch</li>
                <ul>
                  <li>Budget Proposal</li>
                  <li>Deploy Public Treasury</li>
                  <li>Redirect  membership fees into BR Public Treasury</li>
                  <li>Hook claims into budget funding</li>
                  <li>Mint or assign NFT Claims</li>
                  <li>Allow Claim holders to Stake</li>
                  <li>Allow account holders to mint credit tokens</li>
                  <li>Allow Burn/Swap function for the Public Treasury</li>
                </ul>
                <li>Growth</li>
                <ul>
                  <li>Asset and debt deposits/withdrawals</li>
                </ul>    
              </ul>
            </ul>
          </ul>

          <hr/>
          Alpha
          <hr/>
          <ul>
            <li>Landing page</li>
            <ul>
              <li>Portal to membership minting page</li>
              <ul>
                <li>Can become a member</li>
                <li>Can additional donation</li>
              </ul>
              <li>Portal to members services</li>
              <ul>
                <li>Link to Governance</li>
                  <ul>
                    <li>At initiation use snapshot</li>
                  </ul>
                  <li>Link to Virtual Lodge</li>
                  <li>Link to Discord other service</li>
                  <li>Link to Gitbook or other service</li>
              </ul>
            </ul>

            <li>Membership Mint page</li>
            <ul>
              <li>Membership NFTs are deployed to an address and while that remains the address is viewed as a Member</li>
              <li>Wallet login</li>
              <li>Mint button and cost of 0.025 eth</li>
              <li>Add additional donation</li>
              <ul>
                <li>This implies the mint of the membership is granted upon receiving 0.025 ether</li>
              </ul>
              <li>Brief description of the organization</li>
              <li>Disclaimer to be attached to each membership</li>
              <ul>
                <li>The BR Membership NFT grants a membership token gated access to the BR lounge and other services; memberships are valid for a term of 360 days from the time of mint.</li>
              </ul>
              <li>No limit to allowed memberships or donations</li>
              <li>Free mint can be assigned to individuals or lists</li>
            </ul>

            <li>Governors</li>
            <ul>
              <li>Assigned by the BR at initiation</li>
              <li>BR has authority to reassign or delegate authority to members</li>
              <ul>
                <li>Governors are the acting trustees for the organization</li>
                  <ul>
                    <li>At initiation the governor is BMS</li>
                    <li>This will transition to a council </li>
                    <ul>
                      <li>The max limit of council members is 10</li>
                    </ul>
                  </ul>
              </ul>
              <li>Governors can update the following attributes for memberships: </li>
              <ul>
                <li>price, term of deployed memberships; revoke deployed memberships; assign authority to members.</li>
                <li>Governors hold the right to revoke a membership given certain criteria is met</li>
              </ul>
            </ul>

            <li>Escrow: this is the cash account assigned to the BR; management of the escrow has been delegated to the governors</li>
            <ul>
              <li>The governors will delegate authority to a treasurer </li>
              <li>The will be represented as a gnosis safe</li>
              <ul>
                <li>This could be replaced with our own custom contract and interface</li>
                  <ul>
                    <li>This could be the base for the “trust deployer”</li>
                  </ul>
                <li>The following addresses will be the delegated signers</li>  
                  <ul>
                    <li>The max limit of council members is 10</li>
                  </ul>
              </ul>
            </ul>

            <li>Member</li>
            <ul>
              <li>Members are the beneficiaries of the BR </li>
              <li>Members hold the BR membership NFT</li>
              <li>BR members are granted token gated access:</li>
              <ul>
                <li>These are some of the current (alpha) along with future (beta) beneficiary service offers</li>
                <li>Visit the virtual lodge</li>
                  <ul>
                    <li>Meet other members</li>
                    <li>Make budget proposals</li>
                    <li>Make governance proposals</li>
                    <li>Become a delegate</li>
                    <li>Access private discord channels</li>
                  </ul>
                <li>Access equity or credit offerings</li>  
              </ul>
            </ul>
          </ul>

          <hr/>
          Beta
          <hr/>
          <ul>
            <li>Equity NFT (preferred stock/share)</li>
            <ul>
              <li>These are offered to members at 1000 bits per share</li>
              <ul>
                <li>1 bit = 100 sats</li>
                <li>Proceeds from sales will be escrowed in gnosis and managed by assigned governors or executive members</li>
              </ul>
            </ul>

            <li>BAG template framework</li>
            <ul>
              <li>This is be the deployment framework for this type of entity</li>
              <li>This will offer the ability to escrow tokens, assign governor, and offer memberships as a primitive</li>
            </ul>

            <li>Representational Members</li>
            <ul>
              <li>These are members who have been assigned authority to speak on behalf of other members</li>
            </ul>

            <li>Executive Members</li>
            <ul>
              <li>These are members who have been assigned duties by the governing body</li>
            </ul>
          </ul>
           
          <hr/>
          Launch
          <hr/>
          <ul>
            <li>Budget Proposal</li>
            <ul>
              <li>This is the budget constructor and proposal system</li>
              <li>This sets the approval process for the budget</li>
              <li>Funding:</li>
              <ul>
                <li>Hook escrow into bud</li>
                <li>Hook PS into budget funding</li>
              </ul>
              <li>Procedure: </li>
              <ul>
                <li>The governors or executive members propose the budget </li>
                <li>A % of PS holders need to approve the budget</li>
                <li>A % of Representative Members need to approve the budget</li>
                <li>The governors deploy and allocate funding </li>
              </ul>
            </ul>

            <li>Treasury constructor and NFT claim deloyer</li>
            <ul>
              <li>Treasury constructor</li>
                <ul>
                  <li>Treasury Claims [NFTs]</li>
                  <li>The distribution of TC</li>
                  <ul>
                    <li>Assigned</li>
                    <li>Burn/swap w/ PS</li>
                  </ul>  
                </ul>  
              <li>NFT deployer for claims on the BRAG treasury</li>
                <ul>
                  <li>Holders of burn their PS NFTS and mint NFT Claims</li>
                  <li>Holders of NFT claims can burn/swap, stake, or sell</li>
                  <ul>
                    <li>burn/swap their claims at face value of related quantity of treasury reserves</li>
                    <li>Sell on secondary market or over the counter [otc]</li>
                  </ul>  
                </ul>  
            </ul>
          </ul>

          <hr/>
          Growth
          <hr/>
          <ul>
            <li>Asset and debt deposits</li>
            <ul>
              <li>This is a public lending utility framework similar to aave or compound</li>
              <li>Stake their claim and get assigned an allotment of fungible credit tokens</li>
              <ul>
                <li>Credit tokens can be minted at a variable rate by account holder</li>
                <ul>
                  <li>Credit tokens are ‘bits’</li>
                  <li>1 bit = 100 satoshis</li>
                </ul>
              </ul>

              <li>Utilize the public lending protocol framework similar to aave or compound</li>
              <li>Allow for the following assets to be deposited:</li>
              <ul>
                <li>bit</li>
                <li>&nbsp;</li>
              </ul>
              <li>Allow for the following tokens to be minted:</li>
              <ul>
                <li>&nbsp;</li>
              </ul>
            </ul>
          </ul>

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
