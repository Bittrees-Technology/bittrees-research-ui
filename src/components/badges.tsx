import { useUserRoles } from "../lib/community";

/**
 * Role chips shown next to an address in the forum + chat: the admin-assigned
 * roles (Executive / Steward / Researcher / Moderator / custom). Renders nothing
 * if the address has none. (On-chain holding badges — Member / Preferred / Index —
 * are shown on the member's own dashboard, not next to every message.)
 */
export function UserBadges({ address }: { address?: string }) {
  const roles = useUserRoles(address);
  if (!address || roles.length === 0) return null;
  return (
    <span style={{ display: "inline-flex", gap: "0.3rem", flexWrap: "wrap", alignItems: "center" }}>
      {roles.map((r) => {
        const c = r.color || "var(--color-secondary)";
        return (
          <span key={r.label} style={{ ...chipBase, color: c, borderColor: c }}>
            {r.label}
          </span>
        );
      })}
    </span>
  );
}

const chipBase = {
  fontFamily: "var(--font-sans)",
  fontSize: "0.6rem",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  borderRadius: "999px",
  padding: "0.05rem 0.4rem",
  whiteSpace: "nowrap" as const,
  borderWidth: "1px",
  borderStyle: "solid" as const,
} as const;
