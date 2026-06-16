import { PageHeader } from "@/components/PageHeader";
import {
  TOKEN_STACK,
  ORG_ARMS,
  CAPITAL_FLOW,
  GOVERNANCE,
  shortAddr,
} from "@/lib/research";

export default function StructurePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <PageHeader
        label="Structure"
        title="Structure"
        intro="How Bittrees Research is organized — where the foundation sits, the on-chain token stack, the flow of capital, and how it's governed."
      />

      {/* Where Research sits */}
      <section>
        <h2 className="text-title" style={{ marginBottom: "1rem" }}>
          Where Research sits
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--color-ink-muted)", maxWidth: "65ch", marginBottom: "1.25rem" }}>
          Bittrees is a three-part organization. Research is the foundation — the
          Bitcoin-denominated capital intake that issues preferred stock (BNOTE) and the
          Index Token (BIT).
        </p>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {ORG_ARMS.map((arm) => {
            const inner = (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="text-label">{arm.here ? "You are here" : "Sister"}</span>
                  {arm.here && <span className="badge badge-member">Research</span>}
                </div>
                <h3 style={{ fontSize: "1.1rem", margin: "0.35rem 0 0.3rem" }}>{arm.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", margin: 0 }}>{arm.role}</p>
              </>
            );
            return arm.here ? (
              <div
                key={arm.name}
                className="card"
                style={{ borderColor: "var(--color-primary)", borderWidth: "1px", boxShadow: "0 1px 0 var(--color-primary)" }}
              >
                {inner}
              </div>
            ) : (
              <a key={arm.name} href={arm.href} className="card-link">
                {inner}
              </a>
            );
          })}
        </div>
      </section>

      {/* Token stack */}
      <section>
        <h2 className="text-title" style={{ marginBottom: "1rem" }}>
          The token stack
        </h2>
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Standard</th>
                <th>Chain</th>
                <th>Role</th>
                <th className="right">Contract</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_STACK.map((t) => (
                <tr key={t.key}>
                  <td>
                    <span className={`badge ${t.badgeClass}`}>{t.name}</span>
                  </td>
                  <td>{t.standard}</td>
                  <td>{t.chain}</td>
                  <td style={{ maxWidth: "30ch", color: "var(--color-ink-muted)" }}>{t.role}</td>
                  <td className="right">
                    <a
                      href={t.explorer}
                      target="_blank"
                      rel="noreferrer"
                      className="tabular"
                      style={{ color: "var(--color-ink-muted)", textDecoration: "none", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}
                    >
                      {shortAddr(t.address)} ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Capital flow */}
      <section>
        <h2 className="text-title" style={{ marginBottom: "1rem" }}>
          Flow of capital
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "0.5rem" }}>
          {CAPITAL_FLOW.map((s, i) => (
            <div key={s.step} style={{ display: "flex", alignItems: "stretch", gap: "0.5rem", flex: "1 1 200px" }}>
              <div className="card-subtle" style={{ padding: "1rem 1.1rem", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "1.4rem",
                      height: "1.4rem",
                      borderRadius: "999px",
                      background: "var(--color-primary)",
                      color: "#1A1A1A",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <strong style={{ fontSize: "0.95rem" }}>{s.step}</strong>
                </div>
                <p style={{ fontSize: "0.83rem", color: "var(--color-ink-muted)", margin: 0 }}>{s.detail}</p>
              </div>
              {i < CAPITAL_FLOW.length - 1 && (
                <span style={{ alignSelf: "center", color: "var(--color-primary)", fontSize: "1.2rem" }} aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Governance */}
      <section>
        <h2 className="text-title" style={{ marginBottom: "1rem" }}>
          Governance
        </h2>
        <div className="card" style={{ maxWidth: "640px" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
            Research governs off-chain through a Snapshot space, with discussion on the
            community forum.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <a href={GOVERNANCE.snapshot} target="_blank" rel="noreferrer" className="btn-ghost">
              Snapshot · {GOVERNANCE.snapshotSpace} ↗
            </a>
            <a href={GOVERNANCE.forum} target="_blank" rel="noreferrer" className="btn-ghost">
              Governance Forum ↗
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
