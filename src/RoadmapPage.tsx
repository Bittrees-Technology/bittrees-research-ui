import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RoadmapContent } from "./RoadmapContent";

function RoadmapPage() {
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

          <div>
            <ConnectButton />
          </div>

          <div className="mt-4">
            <RoadmapContent />
          </div>

          <footer className="flex flex-col gap-6 mx-auto mt-4">
          <span>
            <a className="hover:text-green-700" href="/members">
              <span className="inline-block align-middle pr-1"><svg className="h-4 w-4 hover:text-green-700"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <circle cx="12" cy="12" r="10" />  <polyline points="12 8 8 12 12 16" />  <line x1="16" y1="12" x2="8" y2="12" /></svg></span>
              <span className="inline-block align-middle underline font-bold font-newtimesroman">Member Services</span>
            </a>
          </span>
            <span>
              <a className="hover:text-green-700" href="https://twitter.com/BittreesR" target="_blank" rel="noreferrer">
                <span className="inline-block align-middle pr-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 hover:text-green-700"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                </span>
                <span className="inline-block align-middle underline font-newtimesroman pr-1">BittreesR</span>
              </a>
            </span>
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

export default RoadmapPage;
