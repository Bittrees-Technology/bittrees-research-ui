import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {Outlet} from "react-router";
import {useLayoutContext} from "@/hooks/useLayoutContext.tsx";

function Layout() {
    const { layoutData } = useLayoutContext();

    return (
        <div className="max-w-4xl mx-auto">
            <Header
                useBittreesBanner={!layoutData.title}
                titleText={layoutData.title}
            />
            <main className="text-center bg-[#dedede]">
                <Outlet />
                <Footer
                    showBackButton={layoutData.showBackButton}
                    backButtonText={layoutData.backButtonText}
                    backButtonTo={layoutData.backButtonTo}
                />
            </main>
        </div>
    )
}

export default Layout;