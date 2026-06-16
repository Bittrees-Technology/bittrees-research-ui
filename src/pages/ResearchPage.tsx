import { PageHeader } from "@/components/PageHeader";
import { RESEARCH_LINKS } from "@/lib/links";

export default function ResearchPage() {
  return (
    <div>
      <PageHeader
        label="Research"
        title="Research Library"
        intro="Original essays and analysis on emerging technology, systems innovation, and the institutions of a more equitable digital future."
      />
      <div className="card-subtle" style={{ padding: "1.5rem", maxWidth: "640px" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>Coming to the site</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
          We're bringing every research post on-site to read natively. For now, the full
          archive lives on Paragraph.
        </p>
        <a className="btn-ghost" href={RESEARCH_LINKS.paragraph} target="_blank" rel="noreferrer">
          Read on Paragraph ↗
        </a>
      </div>
    </div>
  );
}
