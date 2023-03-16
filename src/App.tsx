import { Link } from "react-router-dom";

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="bg-[#dedede] border-b-2 border-gray-500">
        <div className="w-full">
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
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto border border-black p-4 w-80 h-64">
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
          <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center">
            <div className="text-xl">Members-only Services</div>
            <div>Coming Soon!</div>
          </div>

          <footer className="flex flex-col md:flex-row gap-6 mx-auto mt-8 items-center justify-around">
            <div className="underline w-60">
              <a
                href="https://twitter.com/BittreesR"
                target="_blank"
                rel="noreferrer"
              >
                @BittreesR
              </a>
            </div>
            <div className="flex justify-center">
              <Link to="/mint">
                <img
                  src="/bag-logo-circle-smaller.png"
                  width="128px"
                  height="128px"
                  alt="Business Advocacy Group logo"
                />
              </Link>
            </div>
            <div className="underline w-60">
              <a
                href="https://app.gitbook.com/invite/l128PJAr3ltvGCqdsBkP/Q9hrQC2Iz4m6KqyvHx3B
                "
                target="_blank"
                rel="noreferrer"
              >
                Gitbook
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
