import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MintBRGOV } from "./MintBRGOV";

function MintBRGOVPage() {
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
            BRGOV
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
            <div>
              <a href="/" className="mx-auto">
                <img
                  src="/bittrees_logo_tree.png"
                  width="128px"
                  height="128px"
                  alt="Bittrees Research logo"
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
