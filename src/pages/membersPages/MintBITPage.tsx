import { MintBIT } from "@/components/bit/MintBIT.tsx";
import { PageHeader } from "@/components/PageHeader";

export function MintBITPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <PageHeader
        label="Index token"
        title="BIT"
        intro="Lock BNOTE to mint BIT, or redeem BIT back into BNOTE."
      />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
        <img src="/bit-logo.png" alt="BIT — Bittrees Index Token" style={{ width: "110px", height: "auto" }} />
      </div>

      <MintBIT />

      <section className="card" style={{ marginTop: "2.5rem" }}>
        <h2 className="text-title" style={{ marginBottom: "0.75rem" }}>About BIT Tokens</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.9rem", color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
          <p style={{ margin: 0 }}>
            BIT (Bittrees Index Token) is an ERC-20 token that represents a claim on the underlying
            BNOTE tokens locked in the BIT contract. When you mint BIT tokens, your BNOTE tokens are
            locked in the contract and you receive BIT tokens in return.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "var(--color-ink)" }}>Minting:</strong> Lock your BNOTE tokens to
            receive BIT tokens. The conversion rate is determined by the contract's calculation
            algorithm.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "var(--color-ink)" }}>Redeeming:</strong> Burn your BIT tokens to
            retrieve BNOTE tokens from the contract. Note that redemption may include a premium fee.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "var(--color-ink)" }}>Approval Required:</strong> Before minting BIT
            tokens, you need to approve the BIT contract to transfer your BNOTE tokens on your behalf.
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: "var(--color-ink)" }}>Risks:</strong> Please understand that locking
            BNOTE tokens in the BIT contract involves smart contract risks. Only interact with amounts
            you can afford to lose.
          </p>
        </div>
      </section>
    </div>
  );
}
