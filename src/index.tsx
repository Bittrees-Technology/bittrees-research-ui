import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import { WagmiProvider, http } from "wagmi";
import "./index.css";

import Layout from "@/components/layout/Layout";
import { LayoutProvider } from "@/hooks/useLayoutContext.tsx";

import Home from "./pages/Home";
import ResearchPage from "./pages/ResearchPage";
import PostPage from "./pages/PostPage";
import ChatPage from "./pages/ChatPage";
import RoadmapPage from "./pages/RoadmapPage";
import StructurePage from "./pages/StructurePage";
import MembershipPage from "./pages/MembershipPage";
import { MintBNOTEPage } from "./pages/membersPages/MintBNOTEPage.tsx";
import { MintBITPage } from "./pages/membersPages/MintBITPage.tsx";
import VisionStatementPage from "./pages/VisionStatementPage.tsx";
import CodeOfEthicsPage from "./pages/CodeOfEthicsPage.tsx";

import { ALL_CHAINS as chains } from "./lib/constants/chains.ts";

const config = getDefaultConfig({
  appName: "Bittrees Research",
  projectId: "8971e0de563ab27ccfff96c91ac1c3c3",
  chains,
  transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
  ssr: false,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "research", element: <ResearchPage /> },
      { path: "research/:slug", element: <PostPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "bnote", element: <MintBNOTEPage /> },
      { path: "bit", element: <MintBITPage /> },
      { path: "roadmap", element: <RoadmapPage /> },
      { path: "structure", element: <StructurePage /> },
      { path: "membership", element: <MembershipPage /> },
      { path: "vision", element: <VisionStatementPage /> },
      { path: "ethics", element: <CodeOfEthicsPage /> },

      /* Legacy route redirects (preserve bookmarks) */
      { path: "mint", element: <Navigate to="/membership" replace /> },
      { path: "mint-membership", element: <Navigate to="/membership" replace /> },
      { path: "mint-bnote", element: <Navigate to="/bnote" replace /> },
      { path: "mint-bit", element: <Navigate to="/bit" replace /> },
      { path: "mint-brgov", element: <Navigate to="/bnote" replace /> },
      { path: "members", element: <Navigate to="/" replace /> },
      { path: "codeofethics", element: <Navigate to="/ethics" replace /> },
      { path: "visionstatement", element: <Navigate to="/vision" replace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();

root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
