import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { BittreesMark } from "@/components/Brand";
import { MembershipMint } from "@/components/membership/MembershipMint";
import { FAMILY_LINKS } from "@/lib/links";

/**
 * Full-screen membership gate. Everything on Bittrees Research is members-only;
 * non-members see this branded join screen — connect, then mint a membership.
 * On a successful mint, onJoined() flips the app into the members area
 * immediately (ahead of NFT indexing).
 */
export function MembershipGate({ onJoined }: { onJoined: () => void }) {
  const { isConnected } = useAccount();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
      {/* Minimal top bar */}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <BittreesMark />
          <span
            style={{
              fontFamily: "var(--font-logo)",
              fontWeight: 700,
              fontSize: "1.1rem",
              letterSpacing: "-0.01em",
            }}
          >
            Bittrees Research
          </span>
          <div style={{ marginLeft: "auto" }}>
            <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar" />
          </div>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
          padding: "3.5rem 1.5rem",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: "1fr",
          alignItems: "start",
        }}
      >
        {/* Hero */}
        <section>
          <span className="text-label" style={{ color: "var(--color-primary-hover)" }}>
            Members only
          </span>
          <h1 className="text-display" style={{ fontSize: "2.5rem", margin: "0.5rem 0 1rem" }}>
            A research foundation,
            <br />
            built on Bitcoin.
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-ink-muted)", maxWidth: "46ch", lineHeight: 1.6 }}>
            Bittrees Research studies emerging technology, systems innovation, and the
            institutions of a more equitable digital future. Membership unlocks original
            research, Bitcoin-backed preferred stock (BNOTE), the Bittrees Index Token
            (BIT), and a private members community.
          </p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "1.75rem 0 0",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <li className="badge badge-member">Original research</li>
            <li className="badge badge-preferred">Preferred stock · BNOTE</li>
            <li className="badge badge-index">Index token · BIT</li>
            <li className="badge badge-researcher">Members community</li>
          </ul>
        </section>

        {/* Join card */}
        <section className="card" style={{ padding: "1.75rem", maxWidth: "440px" }}>
          <h2 className="text-title" style={{ marginBottom: "0.35rem" }}>
            Join Bittrees Research
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", marginBottom: "1.25rem" }}>
            Membership is an on-chain pass (an ERC-1155 token on Ethereum) valid for 360
            days. Connect your wallet to begin.
          </p>

          {!isConnected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "flex-start" }}>
              <ConnectButton chainStatus="icon" showBalance={false} />
              <p style={{ fontSize: "0.8rem", color: "var(--color-ink-dim)" }}>
                Already a member? Connect and you'll go straight in.
              </p>
            </div>
          ) : (
            <MembershipMint mode="join" onMinted={onJoined} />
          )}
        </section>
      </main>

      {/* Family footer */}
      <footer style={{ borderTop: "1px solid var(--color-border)", background: "#fff" }}>
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "1rem 1.5rem",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span className="text-label">Bittrees</span>
          {FAMILY_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{ fontSize: "0.8rem", color: "var(--color-ink-muted)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
