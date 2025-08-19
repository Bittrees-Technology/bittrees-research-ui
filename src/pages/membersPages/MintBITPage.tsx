import {MintBIT} from "@/components/bit/MintBIT.tsx";
import {useSetLayoutData} from "@/hooks/useSetLayoutData.tsx";

export function MintBITPage() {
    useSetLayoutData({
        title: 'Bittrees Index Token',
        showBackButton: true,
        backButtonText: 'Member Services',
        backButtonTo: '/members'
    });

    return (
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
            <div className="mx-auto flex flex-col items-center max-w-md drop-shadow-xl">
                <img
                    src={`/bit-logo.png`}
                    width="50%"
                    height="50%"
                    alt="BIT - Bittrees Index Token"
                />
            </div>
            <div className="mt-4 mb-4 w-full">
                <MintBIT/>
            </div>
            <div className="space-y-5 mt-8 text-left mx-8 font-newtimesroman">
                <div>
                    <hr className="border-gray-500"/>
                </div>
                <p className="font-bold">
                    About BIT Tokens:
                </p>
                <p>
                    BIT (Bittrees Index Token) is an ERC-20 token that represents a
                    claim on the underlying BNOTE tokens locked in the BIT contract.
                    When you mint BIT tokens, your BNOTE tokens are locked in the
                    contract and you receive BIT tokens in return.
                </p>
                <p>
                    <span className="font-bold">Minting:</span> Lock your BNOTE tokens
                    to receive BIT tokens. The conversion rate is determined by the
                    contract's calculation algorithm.
                </p>
                <p>
                    <span className="font-bold">Redeeming:</span> Burn your BIT tokens
                    to retrieve BNOTE tokens from the contract. Note that redemption
                    may include a premium fee.
                </p>
                <p>
                    <span className="font-bold">Approval Required:</span> Before minting
                    BIT tokens, you need to approve the BIT contract to transfer your
                    BNOTE tokens on your behalf.
                </p>
                <p>
                    <span className="font-bold">Risks:</span> Please understand that
                    locking BNOTE tokens in the BIT contract involves smart contract
                    risks. Only interact with amounts you can afford to lose.
                </p>
            </div>
        </div>
    );
}