import { Link } from "react-router-dom";

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-[#dedede] border-b-2 border-gray-500">
        <div className="w-full">
          <img
            className="mx-auto"
            src="/br-banner.jpg"
            width="75%"
            height="75%"
            alt="Bittrees Research banner"
          />
        </div>
      </header>

      <main className="text-center bg-[#dedede]">
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto border border-black p-4 w-80 h-64 shadow-md shadow-gray-500 hover:shadow-black">
            <Link to="/mint" className="flex flex-col items-center">
              <div className="text-xl">Mint Membership</div>
              <div className="mt-6">
                <img
                  src="/br-logo.jpg"
                  width="128px"
                  height="128px"
                  alt="Bittrees Research logo"
                />
              </div>
            </Link>
          </div>
          <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center shadow-md shadow-gray-500 hover:shadow-black">

              <div className="text-xl">Members-only Services</div>
              <div className="mt-6">
                <img
                  src="/br-logo.jpg"
                  width="128px"
                  height="128px"
                  alt="Bittrees Research logo"
                />
              </div>
            
          </div>

          <footer className="flex flex-col md:flex-row gap-6 mx-auto mt-8 items-center justify-around">
            <div className="underline w-60">
              <a
                href="https://twitter.com/BittreesR"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="mx-auto"
                  src="/twitter.svg"
                  width="100"
                  height="100"
                  alt="Bittrees Research logo"
                />
              </a>
            </div>
            <div className="flex justify-center">
              <a
                href="https://www.voxels.com/play?coords=W@429W,182S"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="mx-auto"
                  src="/bittrees_logo_tree.png"
                  width="100"
                  height="100"
                  alt="Bittrees Research logo"
                />
              </a>
            </div>
            <div className="w-60">
              <a
                href="https://paragraph.xyz/@bittrees_research"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="mx-auto"
                  src="/paragraph-logo.png"
                  width="100"
                  height="100"
                  alt="paragraph.xyz logo"
                />
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
