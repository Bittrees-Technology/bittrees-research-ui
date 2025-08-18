import {useAccount} from "wagmi";
import {MembersContent} from "@/content/MembersContent.tsx";
import {useMembershipValidation} from "@/hooks/membership/useMembershipValidation.tsx";
import {Link} from "react-router";
import {useSetLayoutData} from "@/hooks/useSetLayoutData.tsx";

function MembersPage() {
    const { hasValidMembership, isLoading, isConnected } = useMembershipValidation();
    const { isConnecting } = useAccount();

    useSetLayoutData({
        title: 'Member Services',
        showBackButton: true,
        backButtonText: 'Bittrees Research Home',
        backButtonTo: '/'
    });

    // Show loading while connecting to wallet OR checking membership
    if (isConnecting || isLoading) {
        return (
            <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
                <p className="text-2xl mt-4">Loading...</p>
            </div>
        );
    }

    // Wallet not connected
    if (!isConnected) {
        return (
            <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
                <div className="mt-4">
                    Please connect your wallet to verify membership.
                </div>
            </div>
        );
    }

    // Wallet connected and has valid membership
    if (hasValidMembership) {
        return (
            <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
                <div className="mt-4">
                    <MembersContent />
                </div>
            </div>
        );
    }

    // Wallet connected but no valid membership
    return (
        <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
            <div className="m-4 mx-auto max-w-xl font-newtimesroman">
                <Link to="/mint-membership">Please go mint your membership!</Link>
            </div>
        </div>
    );
}

export default MembersPage;