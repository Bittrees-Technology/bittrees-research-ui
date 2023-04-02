import { useAccount, useContract, useContractRead } from "wagmi";
import abi from "./abi.json";
import { goerli, mainnet } from "wagmi/chains";
import { ethers } from "ethers";
import { useState, useEffect } from "react";

const CONTRACT_ADDRESS = "0xc8121e650bd797d8b9dad00227a9a77ef603a84a";
const chainId =
  process.env.REACT_APP_ENABLE_TESTNETS === "true" ? goerli.id : mainnet.id;

//console.info(`Contract: ${CONTRACT_ADDRESS}`);
//console.info(`Chain ID: ${chainId}`);

export function MembersContent() {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNFTOwner, setNFTOwner] = useState(false);
 
  const { address } = useAccount();
  console.info(`address: ${address}`);

  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  })

  console.log(contract);

  // testing - results in error, should return boolean, there is a tokenId of 0x01
  const contractRead = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'isExpired',
    chainId: chainId,
    args: [ 1 ],
    onSettled(data, error) {
      console.log('Settled', { data, error })
    },
  })

  // if (!isError) {
  //console.log("data: "+ JSON.stringify(data));
  // }


  //0x01
  //console.log(JSON.stringify(isError));

  // const contractAddress = '0xc8121e650bd797d8b9dad00227a9a77ef603a84a'
  // const provider =  new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN");
  // const contract =  new ethers.Contract( contractAddress , abi , provider );
  // const expired =  contract.isExpired('1');

  
  let alchemyEndpoint = "https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN/getNFTs/?owner=" + address;
 
  // TESTING... Hardcoded the address 0x7435e7f3e6B5c656c33889a3d5EaFE1e17C033CD. 
  //alchemyEndpoint = "https://eth-mainnet.g.alchemy.com/v2/g6X4-HRGshx5XNp7gpDxLPeX-WSpw9pN/getNFTs/?owner=0x7435e7f3e6B5c656c33889a3d5EaFE1e17C033CD";
  console.log("alchemyEndpoint: " + alchemyEndpoint);

  useEffect(() => {
    fetch( alchemyEndpoint )
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
              setNFTOwner(true);
              setLoading(false);
              setNftData(nftInfo);
              console.log(nftData);
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
        {loading && isNFTOwner && <p className="text-2xl mt-4">Loading...</p>}
      </div>



      {isNFTOwner && (
          <div className="m-4 mx-auto max-w-xl">
            Members Content!!!

            <br/><br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

            <br/>
            {chainId}
            <br/>
            {CONTRACT_ADDRESS}
            <br/>
            {JSON.stringify(nftData)}




          </div>
        )}

      {!isNFTOwner && (
          <div className="m-4 mx-auto max-w-xl">
            Please go mint your membership!




          </div>
        )}


    </>
  );
}
