import {ConnectButton} from '@rainbow-me/rainbowkit';
import {TestnetToggle} from "./TestnetToggle.tsx";

export const ConnectWallet = () => {
    return (
        <div className="flex flex-row gap-4 items-center">
            <ConnectButton />
            <TestnetToggle />
        </div>
    );
};