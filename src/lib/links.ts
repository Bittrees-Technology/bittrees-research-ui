/* Single source of truth for external + family links.
   Keeps the chrome, dashboard, and footer in sync. */

/** The Bittrees family of sites (the 3-in-1 org + hub). */
export const FAMILY_LINKS = [
  { label: "Governance", href: "https://gov.bittrees.org", desc: "Bittrees, Inc." },
  { label: "Capital", href: "https://capital.bittrees.org", desc: "Holdings & treasury" },
  { label: "Home", href: "https://bittrees.org", desc: "bittrees.org" },
] as const;

/** Bittrees Research external presences (governance, forum, social, publishing). */
export const RESEARCH_LINKS = {
  snapshot: "https://snapshot.box/#/s:research.bittrees.eth",
  forum: "https://metaforo.io/g/bittreesresearch",
  twitter: "https://twitter.com/bresearch_",
  paragraph: "https://paragraph.com/@bresearch",
} as const;

/** Paragraph publication slug (RSS pulled server-side via /api/posts). */
export const PARAGRAPH_SLUG = "@bresearch";

/** On-chain references. */
export const EXPLORERS = {
  membership: "https://etherscan.io/token/0xc8121e650bd797d8b9dad00227a9a77ef603a84a",
  bnoteEth: "https://etherscan.io/address/0xf1AAfFc982B5F553a730a9eC134715a547f1fe80",
  bnoteBase: "https://basescan.org/address/0xf1AAfFc982B5F553a730a9eC134715a547f1fe80",
  bit: "https://etherscan.io/token/0x57A447E4d5e18A9423408C365963A73F08B9d18C",
} as const;
