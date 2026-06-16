import { BittreesMark } from "@/components/Brand";
import { FAMILY_LINKS, RESEARCH_LINKS } from "@/lib/links";

const linkStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  color: "var(--color-ink-muted)",
  textDecoration: "none",
};

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
          padding: "2rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BittreesMark size={26} />
          <span
            style={{
              fontFamily: "var(--font-logo)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--color-ink)",
            }}
          >
            Bittrees Research
          </span>
        </div>

        <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
          <FooterCol title="Bittrees">
            {FAMILY_LINKS.map((l) => (
              <a key={l.href} href={l.href} style={linkStyle}>
                {l.label}
              </a>
            ))}
          </FooterCol>
          <FooterCol title="Community">
            <a href={RESEARCH_LINKS.snapshot} style={linkStyle} target="_blank" rel="noreferrer">
              Snapshot
            </a>
            <a href={RESEARCH_LINKS.forum} style={linkStyle} target="_blank" rel="noreferrer">
              Forum
            </a>
            <a href={RESEARCH_LINKS.twitter} style={linkStyle} target="_blank" rel="noreferrer">
              Twitter
            </a>
            <a href={RESEARCH_LINKS.paragraph} style={linkStyle} target="_blank" rel="noreferrer">
              Paragraph
            </a>
          </FooterCol>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--color-border-light)",
          maxWidth: "1140px",
          margin: "0 auto",
          padding: "0.9rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "var(--color-ink-dim)",
            fontFamily: "var(--font-serif)",
            margin: 0,
          }}
        >
          Members-only research foundation &middot; informational only — not investment,
          legal, or tax advice, and not an offer to sell any security.
        </p>
        <p style={{ fontSize: "0.72rem", color: "var(--color-ink-dim)", margin: 0, whiteSpace: "nowrap" }}>
          &copy; {new Date().getFullYear()} Bittrees Research
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <span className="text-label">{title}</span>
      {children}
    </div>
  );
}
