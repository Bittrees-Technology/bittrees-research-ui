import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import { WagmiProvider } from "wagmi";
import "./index.css";

import { wagmiConfig } from "@/lib/wagmi.ts";
import Layout from "@/components/layout/Layout";
import { LayoutProvider } from "@/hooks/useLayoutContext.tsx";

import Home from "./pages/Home";
import ResearchPage from "./pages/ResearchPage";
import PostPage from "./pages/PostPage";
import Forum from "./pages/Forum";
import ForumThread from "./pages/ForumThread";
import ChatPage from "./pages/ChatPage";
import StructurePage from "./pages/StructurePage";
import MembershipPage from "./pages/MembershipPage";
import Admin from "./pages/Admin";
import { MintBNOTEPage } from "./pages/membersPages/MintBNOTEPage.tsx";
import { MintBITPage } from "./pages/membersPages/MintBITPage.tsx";
import VisionStatementPage from "./pages/VisionStatementPage.tsx";
import CodeOfEthicsPage from "./pages/CodeOfEthicsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "research", element: <ResearchPage /> },
      { path: "research/:slug", element: <PostPage /> },
      { path: "forum", element: <Forum /> },
      { path: "forum/:id", element: <ForumThread /> },
      { path: "chat", element: <ChatPage /> },
      { path: "bnote", element: <MintBNOTEPage /> },
      { path: "bit", element: <MintBITPage /> },
      { path: "structure", element: <StructurePage /> },
      { path: "membership", element: <MembershipPage /> },
      { path: "admin", element: <Admin /> },
      { path: "vision", element: <VisionStatementPage /> },
      { path: "ethics", element: <CodeOfEthicsPage /> },

      /* Legacy route redirects (preserve bookmarks) */
      { path: "mint", element: <Navigate to="/membership" replace /> },
      { path: "mint-membership", element: <Navigate to="/membership" replace /> },
      { path: "mint-bnote", element: <Navigate to="/bnote" replace /> },
      { path: "mint-bit", element: <Navigate to="/bit" replace /> },
      { path: "mint-brgov", element: <Navigate to="/bnote" replace /> },
      { path: "members", element: <Navigate to="/" replace /> },
      { path: "roadmap", element: <Navigate to="/" replace /> },
      { path: "codeofethics", element: <Navigate to="/ethics" replace /> },
      { path: "visionstatement", element: <Navigate to="/vision" replace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const queryClient = new QueryClient();

root.render(
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <LayoutProvider>
          <RouterProvider router={router} />
        </LayoutProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
