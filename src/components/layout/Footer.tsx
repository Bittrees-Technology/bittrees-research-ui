import {ConnectWallet} from "@/components/ConnectWallet.tsx";
import {Link} from "react-router";
import BackButton from "@/components/BackButton.tsx";

interface FooterProps {
    showBackButton?: boolean;
    backButtonText?: string;
    backButtonTo?: string;
}

function Footer({backButtonTo = "/", backButtonText = "Back", showBackButton = true}: FooterProps) {
    return (
        <footer className="flex flex-col gap-6 mx-auto mt-4 items-center">
            {showBackButton && (
                <BackButton to={backButtonTo} text={backButtonText}/>
            )}
            <span>
              <div>
                <ConnectWallet />
              </div>
            </span>

            <div className="flex w-full justify-center items-center">
                <Link to="/" className="mx-auto">
                    <img
                        src="/bittrees_logo_tree.png"
                        width="128px"
                        height="128px"
                        alt="Bittrees Research logo"
                        className="grayscale max-w-xs transition duration-300 ease-in-out hover:scale-110"
                    />
                </Link>
            </div>
        </footer>
    )
}

export default Footer;