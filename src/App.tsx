import { Link } from "react-router-dom";

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      
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
            <Link to="/members" className="flex flex-col items-center">
              <div className="text-xl">Members-only Services</div>
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

        </div>
      </main>
    </div>
  );
}

export default App;
