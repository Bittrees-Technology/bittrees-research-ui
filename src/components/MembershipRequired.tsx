import { useAccount } from "wagmi";
import { useMembershipValidation } from "@/hooks/membership/useMembershipValidation";
import { Link, Outlet } from "react-router";

export function MembershipRequired() {
    const { hasValidMembership, isLoading, isConnected } = useMembershipValidation();
    const { isConnecting } = useAccount();

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

    // Wallet connected but no valid membership
    if (!hasValidMembership) {
        return (
            <div className="flex flex-col gap-3 p-4 md:p-12 items-center">
                <div className="m-4 mx-auto max-w-xl font-newtimesroman">
                    <Link to="/mint-membership">Please go mint your membership!</Link>
                </div>
            </div>
        );
    }

    // Wallet connected and has valid membership - render the protected content
    return <Outlet />;
}