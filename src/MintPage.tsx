import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Mint } from "./Mint";

function MintPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-[#dedede] border-b-2 border-gray-500">
        <div className="w-full bg-red-500">
          <img
            className=""
            src="/br-banner.jpg"
            width="1000"
            height="500"
            alt="Bittrees Research banner"
          />
        </div>
      </header>

      <main className="text-center bg-[#dedede]">
        <div className="flex flex-col gap-3 p-6 items-center">
          <div className="mx-auto flex flex-col items-center">
            <div className="text-xl">Bittrees Research Membership</div>
            <img
              src="/br-logo.jpg"
              width="128px"
              height="128px"
              alt="Bittrees Research logo"
            />
          </div>
          <div>
            <Mint />
          </div>
          <div>
            <ConnectButton />
          </div>
          <div className="space-y-5 mt-8">
            <div className="md:px-8">
              <hr className="border-gray-500" />
            </div>
            <p className="md:px-12 text-justify">
              Bittrees Research is an organization focused on promoting research
              in emerging technologies, systems innovation, and related fields
              with a goal of creating new knowledge and tools whilst fostering
              innovation with a positive impact in the metaverse and beyond.
            </p>
            <p className="md:px-12 text-justify">
              By studying a wide range of topics, Bittrees Research generates
              insights that can inform policy, strategy, and decision-making
              processes, helping to advance society towards a better future.
            </p>
            <p className="md:px-12 text-justify">
              Bittrees Research places a strong emphasis on historical and
              contextual relevance, recognizing the importance of understanding
              past successes and failures in order to develop effective
              solutions for a more just and equitable society. Join the
              conversation on how emerging technologies and systems innovation
              can help create a more equitable and sustainable world.
            </p>
            <p className="md:px-12 text-justify">
              Memberships are subject to an expiration 360 days from the date of
              mint.
            </p>
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
