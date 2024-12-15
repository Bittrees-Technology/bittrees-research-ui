import { Link } from "react-router-dom";

function App() {
  return (
    <div className="max-w-4xl mx-auto">
      <main className="bg-[#dedede] flex flex-col h-screen justify-center items-center">
        <div className="flex flex-col gap-6 p-6">
          <Link to="/mint" className="flex flex-col items-center">
            <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center shadow-md shadow-gray-500 hover:shadow-black">
              <div className="text-xl">Become a Member</div>
            </div>
          </Link>
          <Link to="/members" className="flex flex-col items-center">
            <div className="mx-auto border border-black p-4 w-80 h-64 flex flex-col justify-center items-center shadow-md shadow-gray-500 hover:shadow-black">
              <div className="text-xl">Members Portal</div>
            </div>
          </Link>
          <footer className="flex flex-col gap-6 mx-auto mt-4">
            <span>
              <a className="hover:text-green-700" href="https://bittrees.org">
                <span className="inline-block align-middle pr-1">
                  <svg
                    className="h-4 w-4 hover:text-green-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <circle cx="12" cy="12" r="10" />{" "}
                    <polyline points="12 8 8 12 12 16" />{" "}
                    <line x1="16" y1="12" x2="8" y2="12" />
                  </svg>
                </span>
                <span className="inline-block align-middle underline font-bold font-newtimesroman">
                  Back
                </span>
              </a>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
