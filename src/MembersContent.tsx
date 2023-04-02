import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import abi from "./abi.json";
import { goerli, mainnet } from "wagmi/chains";
import { ethers } from "ethers";
import { useState } from "react";

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
 
  const { address } = useAccount();
  console.info(`address: ${address}`);

  function lookForNFTs() {

    fetch(`https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN/getNFTs/?owner=0x7435e7f3e6B5c656c33889a3d5EaFE1e17C033CD`)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log(result);
        if (result.ownedNfts.length == 0) {
          console.log("No NFTs.")
        } else {
          for(let i = 0; i < result.ownedNfts.length; i++) {
            let nftInfo = result.ownedNfts[i];
            console.log("contract address: " + nftInfo.contract.address);
            if(nftInfo.contract.address === CONTRACT_ADDRESS) {
              console.info("Bittrees Research contract found!!!")
              return true;
            } else {
              console.info("Not a Bittrees Research contract.")
            }
          }

        }
      },
      (error) => {
        console.log(error);
      }
    )
    return false;
  }



    // alchemy.nft.getNftsForOwner({ssx.address()}`)
    //   .then((nfts) => {
    //     const ownENS = nfts.ownedNfts
    //       .filter(({ contract }) => contract.address === CONTRACT_ADDRESS)?.length > 0;
    //     console.log("It worked!");
    //   };


  return (
    <>

      {!address && (
          <p className="text-2xl mt-4">Please connect your wallet.</p>
       )}


      <div className="mt-4">


        <button
          className="btn btn-primary"
          onClick={lookForNFTs}
        >
          Authenticate
        </button>


        {lookForNFTs() && (
          <div className="m-4 mx-auto max-w-xl">
            Members Content!!! For some reason it keeps returning false.
          </div>
        )}

      </div>


    </>
  );
}
