import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintBRGOV } from "./MintBRGOV";

function MintBRGOVPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="border-2 border-b-0 bg-white">
        <div className="w-full">
          <a href="./" className="mx-auto">
            <div className="font-newtimesroman pt-10 pb-6 text-4xl sm:text-6xl text-center font-bold tracking-wider">
              Bittrees, Inc
            </div>
          </a>
        </div>
      </header>

      <main className="text-center bg-white border-2 border-t-0">
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
          <div className="mx-auto flex flex-col items-center max-w-md drop-shadow-xl">
            <img
              src="/bgov-cert-sm.png"
              width="1000px"
              height="566px"
              alt="BGOV Certificate of Stock"
            />
          </div>
          <div className="mt-4">
            <MintBRGOV />
          </div>
          <div>
            <ConnectButton />
          </div>
          <div className="space-y-5 mt-8 font-newtimesroman">
            <div className="md:px-8">
              <hr className="border-gray-500" />
            </div>
            <p className="md:px-12 text-justify">
              Disclaimer:
              <br />
              <br />
              BGOV tokens are a form of equity in Bittrees, Inc. and represent
              ownership in the organization. As a result, owning BGOV tokens
              gives the holder certain rights and privileges, such as voting on
              important company decisions and receiving a portion of profits
              through dividends. However, please note that owning BGOV tokens
              also involves certain risks, and that the value of the tokens may
              fluctuate based on a variety of factors, including market
              conditions and the performance of the company. It is important to
              carefully consider these risks before minting BGOV tokens.
              <br />
              <br />
              Additionally, BGOV tokens are subject to different holding levels
              for different levels of ownership, influence, and rewards in the
              company. To become a Partner of Bittrees, Inc., a holder must own
              at least 420 BGOV tokens, which represents a significant ownership
              stake in the organization. Junior Partners must hold at least 210
              BGOV tokens, and Associates must hold at least 69 BGOV tokens.
              These holding levels are not subject to change and are designed to
              ensure that ownership and influence in the company are distributed
              fairly among stakeholders.
              <br />
              <br />
              Please note that Bittrees, Inc. does not provide investment advice
              and is not responsible for any investment decisions made by
              individuals. It is recommended that potential investors conduct
              thorough research and seek professional advice before investing in
              BGOV tokens.
            </p>
          </div>
          <footer className="flex flex-col gap-6 mx-auto mt-4">
            <span>
              <a className="hover:text-green-700" href="/">
                <span className="inline-block align-middle pr-1">
                  <svg
                    className="h-4 w-4 hover:text-green-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />{" "}
                    <polyline points="12 8 8 12 12 16" />{" "}
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

export default MintBRGOVPage;
