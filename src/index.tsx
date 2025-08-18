import {RainbowKitProvider, getDefaultConfig} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import {Navigate, RouterProvider, createBrowserRouter, Link} from "react-router";
import {WagmiProvider, http} from "wagmi";
import HomePage from "./pages/HomePage.tsx";
import {MintBITPage} from "./pages/membersPages/MintBITPage.tsx";
import {MintBNOTEPage} from "./pages/membersPages/MintBNOTEPage.tsx";
import CodeOfEthicsPage from "./pages/CodeOfEthicsPage.tsx";
import "./index.css";
import MembersPage from "./pages/membersPages/MembersPage.tsx";
import MintMembershipPage from "./pages/MintMembershipPage.tsx";
import VisionStatementPage from "./pages/VisionStatementPage.tsx";
import {ALL_CHAINS as chains} from "./lib/constants/chains.ts";
import Layout from "@/components/layout/Layout.tsx";
import {LayoutProvider} from "@/hooks/useLayoutContext.tsx";
import {MembershipRequired} from "@/components/MembershipRequired.tsx";

// Configure wagmi and RainbowKit
const config = getDefaultConfig({
    appName: "Bittrees Research",
    projectId: "8971e0de563ab27ccfff96c91ac1c3c3",
    chains,
    transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
    ssr: false, // Set to true if using Next.js
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "/mint",
                element: <Navigate to="/mint-membership"/>,
            },
            {
                path: "/mint-membership",
                element: <MintMembershipPage />,
            },
            {
                path: "/mint-bnote",
                element: <MembershipRequired />,
                children: [
                    {
                        index: true,
                        element: <MintBNOTEPage />
                    }
                ]
            },
            {
                path: "/mint-bit",
                element: <MembershipRequired />,
                children: [
                    {
                        index: true,
                        element: <MintBITPage />
                    }
                ]
            },
            {
                path: "/mint-brgov",
                element: (
                    <div className="p-10">
                        Please visit{" "}
                        <Link to="/mint-bnote" className="underline">
                            Bittrees Research Preferred Stock
                        </Link>
                        .
                    </div>
                ),
            },
            {
                path: "/members",
                element: <MembershipRequired />,
                children: [
                    {
                        index: true,
                        element: <MembersPage />
                    }
                ]
            },
            {
                path: "/codeofethics",
                element: <CodeOfEthicsPage/>,
            },
            {
                path: "/visionstatement",
                element: <VisionStatementPage/>,
            },
        ]
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
                <LayoutProvider>
                    <RouterProvider router={router}/>
                </LayoutProvider>
            </RainbowKitProvider>
        </QueryClientProvider>
    </WagmiProvider>
);
