import { Link } from "react-router";
import { useMembershipStatus } from "@/hooks/membership/useMembershipStatus";
import { RESEARCH_LINKS } from "@/lib/links";

interface Section {
  to: string;
  label: string;
  title: string;
  desc: string;
}

const SECTIONS: Section[] = [
  { to: "/research", label: "Research", title: "Research Library", desc: "Original essays and analysis, published natively." },
  { to: "/chat", label: "Community", title: "Members Chat", desc: "Gated rooms, direct messages, and announcements." },
  { to: "/bnote", label: "Preferred", title: "BNOTE", desc: "Bitcoin-backed preferred stock of the foundation." },
  { to: "/bit", label: "Index", title: "BIT", desc: "Convert BNOTE into the Bittrees Index Token." },
  { to: "/roadmap", label: "Roadmap", title: "Roadmap", desc: "Where Bittrees Research is headed." },
  { to: "/structure", label: "Structure", title: "Structure", desc: "Governance, tokens, and the entity map." },
];

export default function Home() {
  const { daysLeft, expiringSoon } = useMembershipStatus();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Hero + status */}
      <section>
        <span className="text-label" style={{ color: "var(--color-primary-hover)" }}>
          Members area
        </span>
        <h1 className="text-display" style={{ fontSize: "2.25rem", margin: "0.4rem 0 0.75rem" }}>
          Welcome to Bittrees Research
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--color-ink-muted)", maxWidth: "60ch" }}>
          Original research, Bitcoin-backed instruments, and a private members
          community — all in one place.
        </p>

        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span className="badge badge-member">Member</span>
          {daysLeft !== undefined && (
            <span style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)" }}>
              {expiringSoon ? "Expires in" : "Active for"}{" "}
              <strong style={{ color: expiringSoon ? "#B54708" : "var(--color-ink)" }}>
                {daysLeft} days
              </strong>
            </span>
          )}
          <Link
            to="/membership"
            className={expiringSoon ? "btn-primary" : "btn-ghost"}
            style={{ fontSize: "0.78rem", padding: "0.35rem 0.9rem" }}
          >
            {expiringSoon ? "Renew membership" : "Manage membership"}
          </Link>
        </div>
      </section>

      <hr className="gold-rule" />

      {/* Sections */}
      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {SECTIONS.map((s) => (
          <Link key={s.to} to={s.to} className="card-link">
            <span className="text-label">{s.label}</span>
            <h3 style={{ fontSize: "1.15rem", margin: "0.3rem 0 0.4rem" }}>{s.title}</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-ink-muted)", margin: 0 }}>
              {s.desc}
            </p>
          </Link>
        ))}
      </section>

      {/* Secondary links */}
      <section style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
        {[
          { to: "/vision", label: "Vision Statement", external: false as const },
          { to: "/ethics", label: "Code of Ethics", external: false as const },
          { to: RESEARCH_LINKS.snapshot, label: "Snapshot ↗", external: true as const },
          { to: RESEARCH_LINKS.forum, label: "Governance Forum ↗", external: true as const },
        ].map((l) =>
          l.external ? (
            <a
              key={l.to}
              href={l.to}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", textDecoration: "none" }}
            >
              {l.label}
            </a>
          ) : (
            <Link
              key={l.to}
              to={l.to}
              style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", textDecoration: "none" }}
            >
              {l.label}
            </Link>
          )
        )}
      </section>
    </div>
  );
}
