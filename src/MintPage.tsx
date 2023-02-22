import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Mint } from "./Mint";

function MintPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-[#dedede] border-b-2 border-gray-500">
        <div className="w-full bg-red-500">
          <img className="" src="/br-banner.jpg" width="1000" height="500" />
        </div>
      </header>

      <main className="text-center bg-[#dedede]">
        <div className="flex flex-col gap-3 p-6 items-center">
          <div className="mx-auto">
            <div className="text-xl">Bittrees Research Membership</div>
            <img
              src="/br-logo.jpg"
              width="256px"
              height="256px"
              alt="Business Advocacy Group logo"
            />
          </div>
          <div>
            <Mint />
          </div>
          <div>
            <ConnectButton />
          </div>
          <div className="mt-8">
            Bittrees Research -- Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Itaque vero fuga impedit eveniet voluptatum
            voluptatibus cum hic quisquam? Impedit quisquam alias consequuntur
            officiis maiores dolores explicabo laborum natus vitae accusamus.
          </div>
          \{" "}
          <footer className="flex flex-col gap-6 mx-auto">
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
              <img
                src="/bag-logo-circle-smaller.png"
                width="128px"
                height="128px"
                alt="Business Advocacy Group logo"
                className="grayscale"
              />
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default MintPage;
