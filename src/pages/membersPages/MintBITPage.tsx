import { MintBIT } from "@/components/bit/MintBIT.tsx";
import { PageHeader } from "@/components/PageHeader";

export function MintBITPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <PageHeader
        label="Index token"
        title="BIT"
        intro="The Bittrees Index Token wraps BNOTE at the protocol peg (1 BIT = 1/1,000,000 BTC). Lock BNOTE to mint BIT, or redeem BIT back into BNOTE."
      />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
        <img src="/bit-logo.png" alt="BIT — Bittrees Index Token" style={{ width: "110px", height: "auto" }} />
      </div>
      <MintBIT />
    </div>
  );
}
