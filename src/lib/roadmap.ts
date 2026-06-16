/* Native roadmap (replaces the external Google Doc). The platform milestones
   below are accurate to the current refresh; foundation milestones are
   high-level and meant to be expanded with the team's planning doc. */

export type MilestoneStatus = "done" | "active" | "planned";

export interface Milestone {
  title: string;
  status: MilestoneStatus;
  items: string[];
}

export const ROADMAP: Milestone[] = [
  {
    title: "Members platform",
    status: "done",
    items: [
      "Native members site on the Bittrees Brand Standard",
      "On-chain membership with in-app join & renewal",
      "Research library — posts read natively, on-site",
    ],
  },
  {
    title: "Community & capital",
    status: "active",
    items: [
      "Members chat — gated rooms, direct messages, announcements",
      "BNOTE (preferred stock) & BIT (index token) in the members area",
      "Native structure & governance surfacing",
    ],
  },
  {
    title: "Foundation",
    status: "planned",
    items: [
      "Research cadence and contributor onboarding",
      "Expanded governance on Snapshot",
    ],
  },
];

export const STATUS_LABEL: Record<MilestoneStatus, string> = {
  done: "Shipped",
  active: "In progress",
  planned: "Planned",
};
