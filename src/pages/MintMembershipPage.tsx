import { useAccount } from "wagmi";
import { Mint } from "@/components/membership/Mint";
import {MintMembershipContent} from "@/content/MintMembershipContent.tsx";
import {useSetLayoutData} from "@/hooks/useSetLayoutData.tsx";
import {Link} from "react-router";

function MintMembershipPage() {
  const { chain } = useAccount();
  const isCorrectChain = chain?.id === 1;

    useSetLayoutData({
        title: 'Mint Membership',
        showBackButton: true,
        backButtonText: 'Bittrees Research Home',
        backButtonTo: '/'
    });

  return (
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
          <div className="mx-auto flex flex-col items-center max-w-md">
            <img
              src="/bittrees-membership-card.png"
              width="1400px"
              height="800px"
              alt="Bittrees Research Membership Card"
            />
          </div>
          {isCorrectChain && (
            <div className="mt-4">
              <Mint />
            </div>
          )}

          {!isCorrectChain && (
            <div className="mt-4">
              Please connect to Ethereum mainnet.
            </div>
          )}
            <div className="flex gap-24 mt-12 justify-center">
                <Link to='/codeofethics' className='underline hover:text-green-700'>
                    <p>Code of Ethics</p>
                </Link>
                <Link to='/visionstatement' className='underline hover:text-green-700' >
                    <p>Vision Statement</p>
                </Link>
            </div>
          <MintMembershipContent />
        </div>
  );
}

export default MintMembershipPage;
