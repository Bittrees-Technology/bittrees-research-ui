import { PageHeader } from "@/components/PageHeader";
import { ROADMAP, STATUS_LABEL, type MilestoneStatus } from "@/lib/roadmap";
import { RESEARCH_LINKS } from "@/lib/links";

const DOT: Record<MilestoneStatus, { bg: string; ring: string }> = {
  done: { bg: "var(--color-secondary)", ring: "#F0F6F2" },
  active: { bg: "var(--color-primary)", ring: "#FFF6EA" },
  planned: { bg: "var(--color-border)", ring: "var(--color-bg-subtle)" },
};

export default function RoadmapPage() {
  return (
    <div>
      <PageHeader
        label="Roadmap"
        title="Roadmap"
        intro="Where Bittrees Research is headed — milestones for the platform, the foundation's instruments, and the members community."
      />

      <div style={{ maxWidth: "680px" }}>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
          {ROADMAP.map((m, i) => {
            const dot = DOT[m.status];
            const last = i === ROADMAP.length - 1;
            return (
              <li key={m.title} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem" }}>
                {/* Rail */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "999px",
                      background: dot.bg,
                      boxShadow: `0 0 0 4px ${dot.ring}`,
                      marginTop: "0.3rem",
                      flexShrink: 0,
                    }}
                  />
                  {!last && <span style={{ width: "2px", flex: 1, background: "var(--color-border-light)", margin: "0.35rem 0" }} />}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: last ? 0 : "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.15rem" }}>{m.title}</h3>
                    <span
                      className="badge"
                      style={
                        m.status === "done"
                          ? { borderColor: "var(--color-secondary)", color: "var(--color-secondary-hover)", background: "#F0F6F2" }
                          : m.status === "active"
                          ? { borderColor: "var(--color-primary)", color: "var(--color-primary-hover)", background: "#FFF6EA" }
                          : {}
                      }
                    >
                      {STATUS_LABEL[m.status]}
                    </span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {m.items.map((it) => (
                      <li key={it} style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)" }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="card-subtle" style={{ padding: "1rem 1.25rem", marginTop: "2rem" }}>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", margin: 0 }}>
            This roadmap is being migrated from the foundation's planning notes — more
            detail to come. Members can weigh in on the{" "}
            <a href={RESEARCH_LINKS.forum} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary-hover)" }}>
              governance forum
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
