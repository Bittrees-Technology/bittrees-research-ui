import { PageHeader } from "@/components/PageHeader";

export default function RoadmapPage() {
  return (
    <div>
      <PageHeader
        label="Roadmap"
        title="Roadmap"
        intro="Where Bittrees Research is headed — milestones for the foundation, its instruments, and the members community."
      />
      <div className="card-subtle" style={{ padding: "1.5rem", maxWidth: "640px" }}>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", margin: 0 }}>
          A native roadmap is being built here to replace the external document.
        </p>
      </div>
    </div>
  );
}
