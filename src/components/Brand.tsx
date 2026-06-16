/** Shared Bittrees tree mark. */
export function BittreesMark({ size = 30 }: { size?: number }) {
  return (
    <img
      src="/bittrees_logo_tree.png"
      alt="Bittrees"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}
