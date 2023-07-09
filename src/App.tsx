import { Link } from "react-router-dom";

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      <main className="bg-[#dedede] flex flex-col h-screen justify-center items-center">
        <div className="flex flex-col gap-6 p-6">
          <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center shadow-md shadow-gray-500 hover:shadow-black">
            <Link to="/mint" className="flex flex-col items-center">
              <div className="text-xl">Become a Member</div>
            </Link>
          </div>
          <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center shadow-md shadow-gray-500 hover:shadow-black">
            <Link to="/members" className="flex flex-col items-center">
              <div className="text-xl">Members Only Services</div>
            </Link>
          </div>

          <div className="mx-auto">
            <a href="/" className="mx-auto">
              <img
                src="/bittrees_logo_tree.png"
                width="128px"
                height="128px"
                alt="Bittrees Research logo"
                className="max-w-xs transition duration-300 ease-in-out hover:scale-110"
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
