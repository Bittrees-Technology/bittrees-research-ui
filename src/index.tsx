import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, baseSepolia, base } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import App from "./App";
import CodeOfEthicsPage from "./CodeOfEthicsPage";
import "./index.css";
import MembersPage from "./MembersPage";
import MintBRGOVPage from "./BRGOV/MintBRGOVPage";
import MintPage from "./MintPage";
import VisionStatementPage from "./VisionStatementPage";

const myChains =
  process.env.REACT_APP_ENABLE_TESTNETS === "true"
    ? [baseSepolia]
    : [mainnet, baseSepolia, base];
// Configure chains & providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  myChains,
  [
    alchemyProvider({ apiKey: "MY6sRxkJ6Jeo6Pd_6XvgrmvXJFbrQE0w" }),
    publicProvider(),
  ]
);

// Set up wallet connectors
const { connectors } = getDefaultWallets({
  appName: "Bittrees Research",
  projectId: "8971e0de563ab27ccfff96c91ac1c3c3",
  chains,
});

// Create Wagmi config
const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Create ethereum client
const ethereumClient = new EthereumClient(config, chains);

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
    path: "/mint-brgov",
    element: <MintBRGOVPage />,
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
root.render(
  <>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <RouterProvider router={router} />
      </RainbowKitProvider>
    </WagmiConfig>

    <Web3Modal
      projectId="8971e0de563ab27ccfff96c91ac1c3c3"
      ethereumClient={ethereumClient}
    />
  </>
);
