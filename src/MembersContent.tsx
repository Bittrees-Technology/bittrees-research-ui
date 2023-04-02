import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import abi from "./abi.json";
import { goerli, mainnet } from "wagmi/chains";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

//import { Network, Alchemy } from "alchemy-sdk";

//const alchemyConfig = {
//  apiKey: "MY6sRxkJ6Jeo6Pd_6XvgrmvXJFbrQE0w",
//  network: Network.ETH_MAINNET,
//};

//const alchemy = new Alchemy(alchemyConfig);

const CONTRACT_ADDRESS = "0xc8121e650bd797d8b9dad00227a9a77ef603a84a";
const chainId =
  process.env.REACT_APP_ENABLE_TESTNETS === "true" ? goerli.id : mainnet.id;

//console.info(`Contract: ${CONTRACT_ADDRESS}`);
//console.info(`Chain ID: ${chainId}`);


export function MembersContent() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const { address } = useAccount();
  console.info(`address: ${address}`);


    // alchemy.nft.getNftsForOwner({ssx.address()}`)
    //   .then((nfts) => {
    //     const ownENS = nfts.ownedNfts
    //       .filter(({ contract }) => contract.address === CONTRACT_ADDRESS)?.length > 0;
    //     console.log("It worked!");
    //   };


  // Hardcoded the address. Trying to get the address into the fetch url. 

  useEffect(() => {
    fetch("https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN/getNFTs/?owner=0x7435e7f3e6B5c656c33889a3d5EaFE1e17C033CD")
      .then(response => response.json())
      .then((usefulData) => {
        if (usefulData.ownedNfts.length == 0) {
          console.log("No NFTs.")
        } else {
          for(let i = 0; i < usefulData.ownedNfts.length; i++) {
            let nftInfo = usefulData.ownedNfts[i];
            console.log("contract address: " + nftInfo.contract.address);
            if(nftInfo.contract.address === CONTRACT_ADDRESS) {
              console.info("Bittrees Research contract found!!!")
              console.log(nftInfo.id.tokenId);
              console.log(nftInfo.id.tokenMetadata);
              console.log(nftInfo.title);
              setLoading(false);
              setData(nftInfo);
              console.log(data);
              break;
            } else {
              console.info("Not a Bittrees Research contract.")
            }
          }

        }
        // console.log("usefulData: " + usefulData);
        // console.log(usefulData);
        // setLoading(false);
        // setData(usefulData);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`)
      });

  }, []);


  return (
    <>
      <div className="mt-4">
        {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
        )}
        {loading && <p className="text-2xl mt-4">Loading...</p>}
      </div>


      {data && (
          <div className="m-4 mx-auto max-w-xl">
            Members Content!!!

            <br/><br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

            <br/>
            {chainId}
            <br/>
            {CONTRACT_ADDRESS}
            <br/>
            { 

              
            }




          </div>
        )}


    </>
  );
}
