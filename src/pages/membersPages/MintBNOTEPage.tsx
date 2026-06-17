import { MintBNOTE } from "@/components/bnote/MintBNOTE.tsx";
import { PageHeader } from "@/components/PageHeader";

export function MintBNOTEPage() {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <PageHeader
        label="Preferred stock"
        title="BNOTE"
        intro="Bittrees Research Preferred Stock"
      />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
        <img
          src="/bnote-certificate.jpeg"
          alt="BNOTE preferred stock certificate"
          style={{ maxWidth: "460px", width: "100%", height: "auto", borderRadius: "3px", boxShadow: "0 8px 24px rgba(26,22,10,0.14)" }}
        />
      </div>
      <MintBNOTE />
    </div>
  );
}
