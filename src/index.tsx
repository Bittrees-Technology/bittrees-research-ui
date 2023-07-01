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
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import App from "./App";
import CodeOfEthicsPage from "./CodeOfEthicsPage";
import "./index.css";
import MembersPage from "./MembersPage";
import MintBRGOVPage from "./MintBRGOVPage";
import MintPage from "./MintPage";
import reportWebVitals from "./reportWebVitals";
import VisionStatementPage from "./VisionStatementPage";

const myChain =
  process.env.REACT_APP_ENABLE_TESTNETS === "true" ? goerli : mainnet;

const { chains, provider, webSocketProvider } = configureChains(
  [myChain],
  [
    alchemyProvider({ apiKey: "MY6sRxkJ6Jeo6Pd_6XvgrmvXJFbrQE0w" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Bittrees Research",
  projectId: "8971e0de563ab27ccfff96c91ac1c3c3",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/mint",
    element: <Navigate to="/mint/membership" />,
  },
  {
    path: "/mint/membership",
    element: <MintPage />,
  },
  {
    path: "/mint/brgov",
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
    <WagmiConfig client={wagmiClient}>
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
