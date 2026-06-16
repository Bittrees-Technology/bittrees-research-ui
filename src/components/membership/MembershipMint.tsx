import { useEffect, useMemo, useState } from "react";
import { formatEther, parseEther, type Abi } from "viem";
import { mainnet } from "wagmi/chains";
import {
  useAccount,
  useChainId,
  useReadContract,
  useSimulateContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import membershipAbi from "@/lib/constants/membership.abi.json";
import { getContractAddress } from "@/lib/constants/contracts";

const MEMBERSHIP = getContractAddress("membership", mainnet.id);
const MEMBERSHIP_TERM_DAYS = 360;

interface Props {
  mode?: "join" | "renew";
  onMinted?: () => void;
}

/**
 * Join (mint) or Renew (re-mint) a Bittrees Research membership. Renewal is the
 * same on-chain action as joining — a fresh token carries a new 360-day term and
 * the validator accepts any non-expired token. Reads mintPrice() live; an optional
 * donation can be added on top.
 */
export function MembershipMint({ mode = "join", onMinted }: Props) {
  const { address } = useAccount();
  const chainId = useChainId();
  const onMainnet = chainId === mainnet.id;
  const { switchChain, isPending: switching } = useSwitchChain();

  const [donation, setDonation] = useState("");

  const { data: priceWei } = useReadContract({
    address: MEMBERSHIP,
    abi: membershipAbi as Abi,
    functionName: "mintPrice",
    chainId: mainnet.id,
  });
  const basePrice = (priceWei as bigint | undefined) ?? 0n;

  const donationWei = useMemo(() => {
    try {
      return donation ? parseEther(donation) : 0n;
    } catch {
      return 0n;
    }
  }, [donation]);
  const total = basePrice + donationWei;

  const { data: sim, error: simError } = useSimulateContract({
    address: MEMBERSHIP,
    abi: membershipAbi as Abi,
    functionName: "mintMembership",
    args: [address],
    value: total,
    chainId: mainnet.id,
    query: { enabled: Boolean(address) && onMainnet },
  });

  const { writeContract, data: hash, isPending: writing } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) onMinted?.();
  }, [isSuccess, onMinted]);

  const verb = mode === "renew" ? "Renew" : "Join";

  if (isSuccess) {
    return (
      <div className="card-subtle" style={{ padding: "1.25rem", textAlign: "center" }}>
        <p className="text-title" style={{ marginBottom: "0.35rem" }}>
          {mode === "renew" ? "Membership renewed" : "Welcome to Bittrees Research"}
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
          Your membership is active for another {MEMBERSHIP_TERM_DAYS} days. Loading the
          members area&hellip;
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
        Connect your wallet to {verb.toLowerCase()}.
      </p>
    );
  }

  if (!onMainnet) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)" }}>
          Membership lives on Ethereum mainnet. Switch networks to continue.
        </p>
        <button
          className="btn-primary"
          disabled={switching}
          onClick={() => switchChain({ chainId: mainnet.id })}
        >
          {switching ? "Switching…" : "Switch to Ethereum"}
        </button>
      </div>
    );
  }

  const busy = writing || confirming;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.4rem 1rem",
          fontSize: "0.875rem",
          alignItems: "center",
        }}
      >
        <span style={{ color: "var(--color-ink-muted)" }}>Membership term</span>
        <span className="tabular">{MEMBERSHIP_TERM_DAYS} days</span>

        <span style={{ color: "var(--color-ink-muted)" }}>Minimum</span>
        <span className="tabular">{formatEther(basePrice)} ETH</span>

        <span style={{ color: "var(--color-ink-muted)" }}>Add donation</span>
        <span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={donation}
            onChange={(e) => setDonation(e.target.value)}
            style={{
              width: "6.5rem",
              padding: "0.3rem 0.5rem",
              border: "1px solid var(--color-border)",
              borderRadius: "2px",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
            }}
          />{" "}
          ETH
        </span>

        <span style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}>Total</span>
        <span className="tabular" style={{ fontWeight: 700 }}>
          {formatEther(total)} ETH
        </span>
      </div>

      {simError && (
        <p style={{ fontSize: "0.8rem", color: "#b42318" }}>
          {simError.message.split("\n")[0]}
        </p>
      )}

      <button
        className="btn-primary"
        disabled={!sim?.request || busy}
        onClick={() => sim?.request && writeContract(sim.request)}
      >
        {busy ? (confirming ? "Confirming…" : "Check wallet…") : `${verb} — ${formatEther(total)} ETH`}
      </button>
    </div>
  );
}
