import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Mint } from "./Mint";

function MintPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-primary h-56">
        <div className="flex p-4 items-start justify-center">
          <div className="flex-1">&nbsp;</div>
        </div>
        <div className="text-7xl font-bold text-center mt-4">[B | Â | G]</div>
      </header>

      <main className="text-center bg-[#eef3ee]">
        <div className="flex flex-col gap-3 p-6 items-center">
          <div className="mx-auto">
            <div className="text-xl">BAG Membership</div>
            <img
              src="/bag-briefcase.png"
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
            Builders Advocacy Group (BAG) is a Representative Body, Unifying
            &amp; Amplifying the Experience of Voxels Builders.
          </div>
          <div>Become a Member to Have Your Voice Heard.</div>
          <footer className="flex flex-col gap-6 mx-auto">
            <div className="underline">
              <a
                href="https://twitter.com/voxelsadvocacy"
                target="_blank"
                rel="noreferrer"
              >
                @voxelsadvocacy
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
