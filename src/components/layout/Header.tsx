import {Link} from "react-router";

interface HeaderProps {
    useBittreesBanner?: boolean;
    titleText?: string;
}

function Header(
    {useBittreesBanner = true, titleText = "Bittrees Research" }: HeaderProps
) {
    return (
        <header className="bg-[#dedede] border-b-2 border-gray-500">
            <div className="w-full">
                <Link to="/" className="mx-auto">
                    {useBittreesBanner && (
                        <img
                        className="mx-auto"
                        src="/br-banner.jpg"
                        width="75%"
                        height="75%"
                        alt={titleText}
                        />
                    )}
                    {!useBittreesBanner && (
                        <h1 className="text-5xl p-5 font-newtimesroman text-center">
                            {titleText}
                        </h1>
                    )}
                </Link>
            </div>
        </header>
    )
}

export default Header;