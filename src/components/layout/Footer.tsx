import { Link } from "react-router";
import { FAMILY_LINKS, RESEARCH_LINKS } from "@/lib/links";

const linkStyle: React.CSSProperties = {
  fontSize: "0.82rem",
  color: "var(--color-ink-muted)",
  textDecoration: "none",
};

const COLUMNS = [
  {
    title: "Explore",
    internal: true,
    links: [
      { label: "Overview", href: "/" },
      { label: "Research", href: "/research" },
      { label: "Forum", href: "/forum" },
      { label: "Members Chat", href: "/chat" },
      { label: "BNOTE", href: "/bnote" },
      { label: "BIT", href: "/bit" },
      { label: "Structure", href: "/structure" },
      { label: "Membership", href: "/membership" },
    ],
  },
  {
    title: "Bittrees",
    internal: false,
    links: FAMILY_LINKS.map((l) => ({ label: l.label, href: l.href })),
  },
  {
    title: "Community",
    internal: false,
    links: [
      { label: "Twitter / X", href: RESEARCH_LINKS.twitter },
      { label: "Paragraph", href: RESEARCH_LINKS.paragraph },
      { label: "Snapshot", href: RESEARCH_LINKS.snapshot },
      { label: "Governance Forum", href: RESEARCH_LINKS.forum },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "#ffffff",
        fontFamily: "var(--font-sans)",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "2.75rem 1.5rem",
          display: "flex",
          gap: "4rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {COLUMNS.map((col) => (
          <nav key={col.title} style={{ display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "center", textAlign: "center" }}>
            <span className="text-label">{col.title}</span>
            {col.links.map((l) =>
              col.internal ? (
                <Link key={l.label} to={l.href} style={linkStyle}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={linkStyle}>
                  {l.label}
                </a>
              )
            )}
          </nav>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--color-border-light)", padding: "1rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--color-ink-dim)", margin: 0, lineHeight: 1.5 }}>
          Members‑only research foundation · informational only — not investment, legal, or tax advice,
          and not an offer to sell any security. &copy; {new Date().getFullYear()} Bittrees Research
        </p>
      </div>
    </footer>
  );
}
