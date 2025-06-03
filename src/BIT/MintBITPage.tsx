import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintBIT } from "./MintBIT";

export function MintBITPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <header className="border-2 border-b-0 bg-white">
                <div className="w-full">
                    <a href="/mint-bnote" className="mx-auto">
                        <div className="font-newtimesroman pt-10 pb-6 text-4xl sm:text-6xl text-center font-bold tracking-wider">
                            Bittrees Research
                            <br />
                            BIT Token Manager
                        </div>
                    </a>
                </div>
            </header>

            <main className="text-center bg-white border-2 border-t-0">
                <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
                    <div className="mx-auto flex flex-col items-center max-w-md drop-shadow-xl">
                        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">BIT</div>
                                <div className="text-sm">Bittrees Index Token</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mb-4 w-full">
                        <MintBIT />
                    </div>
                    <div>
                        <ConnectButton />
                    </div>
                    <div className="space-y-5 mt-8 text-left mx-8 font-newtimesroman">
                        <div>
                            <hr className="border-gray-500" />
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
                    <footer className="flex flex-col gap-6 mx-auto mt-4">
            <span>
              <a className="hover:text-green-700" href="/members">
                <span className="inline-block align-middle pr-1">
                  <svg
                      className="h-4 w-4 hover:text-green-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 8 8 12 12 16" />
                    <line x1="16" y1="12" x2="8" y2="12" />
                  </svg>
                </span>
                <span className="inline-block align-middle underline font-bold font-newtimesroman">
                  Back
                </span>
              </a>
            </span>
                        <div>
                            <a href="/" className="mx-auto">
                                <img
                                    src="/bittrees_logo_tree.png"
                                    width="128px"
                                    height="128px"
                                    alt="Bittrees Inc logo"
                                    className="grayscale max-w-xs transition duration-300 ease-in-out hover:scale-110"
                                />
                            </a>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}