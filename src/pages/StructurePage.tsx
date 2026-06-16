import { PageHeader } from "@/components/PageHeader";

export default function StructurePage() {
  return (
    <div>
      <PageHeader
        label="Structure"
        title="Structure"
        intro="How Bittrees Research is organized — governance, the token stack (membership, BNOTE, BIT), and where it sits in the wider Bittrees ecosystem."
      />
      <div className="card-subtle" style={{ padding: "1.5rem", maxWidth: "640px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", margin: 0 }}>
          A native structure map is being built here to replace the external diagram.
        </p>
      </div>
    </div>
  );
}
