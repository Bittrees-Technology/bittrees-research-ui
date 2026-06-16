/** The Bittrees Research membership card (the member NFT), framed like an
    elegant gold picture frame. Shown on connect, mint, and renew. */
export function MembershipCard({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <figure className={`member-frame${size === "sm" ? " member-frame--sm" : ""}`} style={{ margin: 0 }}>
      <div className="member-frame-inner">
        <img src="/bittrees-membership-card.png" alt="Bittrees Research membership card" />
      </div>
    </figure>
  );
}
