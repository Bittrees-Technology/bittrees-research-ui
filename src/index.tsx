import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { WagmiProvider, http } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import App from "./App";
import { MintBNOTEPage } from "./BRGOV/MintBNOTEPage";
import CodeOfEthicsPage from "./CodeOfEthicsPage";
import "./index.css";
import MembersPage from "./MembersPage";
import MintPage from "./MintPage";
import VisionStatementPage from "./VisionStatementPage";

const productionChains = [mainnet, base] as const;
const developmentChains = [...productionChains, baseSepolia] as const;

const myChains =
  process.env.REACT_APP_ENABLE_TESTNETS === "true"
    ? developmentChains
    : productionChains;

// Configure wagmi and RainbowKit
const config = getDefaultConfig({
  appName: "Bittrees Research",
  projectId: "8971e0de563ab27ccfff96c91ac1c3c3",
  chains: myChains,
  transports: Object.fromEntries(myChains.map((chain) => [chain.id, http()])),
  ssr: false, // Set to true if using Next.js
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/mint",
    element: <Navigate to="/mint-membership" />,
  },
  {
    path: "/mint-membership",
    element: <MintPage />,
  },
  {
    path: "/mint/bnote",
    element: <MintBNOTEPage />,
  },
  {
    path: "/mint-brgov",
    element: (
      <div className="p-10">
        Please visit{" "}
        <a href="/mint/bnote" className="underline">
          Bittrees Research Preferred Stock
        </a>
        .
      </div>
    ),
  },
  {
    path: "/members",
    element: <MembersPage />,
  },
  {
    path: "/codeofethics",
    element: <CodeOfEthicsPage />,
  },
  {
    path: "/visionstatement",
    element: <VisionStatementPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
