import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CodeOfEthicsContent } from "./CodeOfEthicsContent";

function CodeOfEthicsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-[#dedede] border-b-2 border-gray-500">
        <div className="w-full">
          <a href="./" className="mx-auto">
            <img
              className="mx-auto"
              src="/br-banner.jpg"
              width="75%"
              height="75%"
              alt="Bittrees Research banner"
            />
          </a>
        </div>
      </header>

      <main className="text-center bg-[#dedede]">
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
          <div className="mx-auto flex flex-col items-center max-w-md">
            <img
              src="/bittrees-membership-card.png"
              width="1400px"
              height="800px"
              alt="Bittrees Research Membership Card"
            />
          </div>

          <div>
            <ConnectButton />
          </div>

          <div className="mt-4">
            <CodeOfEthicsContent />
          </div>

          <footer className="flex flex-col gap-6 mx-auto mt-4">
            <div className="underline">
              <a
                href="https://twitter.com/BittreesR"
                target="_blank"
                rel="noreferrer"
              >
                @BittreesR
              </a>
            </div>
            <div>
              <a href="/" className="mx-auto">
                <img
                  src="/bittrees_logo_tree.png"
                  width="128px"
                  height="128px"
                  alt="Bittrees Research logo"
                  className="grayscale"
                />
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default CodeOfEthicsPage;