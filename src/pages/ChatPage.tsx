import { PageHeader } from "@/components/PageHeader";

const ROOMS = [
  { name: "Members Commons", who: "Any active member" },
  { name: "Preferred Stockholders", who: "BNOTE holders" },
  { name: "Index Holders", who: "BIT holders" },
  { name: "Research Guild", who: "Researchers & contributors" },
  { name: "Announcements", who: "Stewards post · all members read" },
];

export default function ChatPage() {
  return (
    <div>
      <PageHeader
        label="Community"
        title="Members Chat"
        intro="A private, wallet-native community — gated rooms, direct messages, and announcements — replacing the old third-party group links."
      />
      <div className="card-subtle" style={{ padding: "1.5rem", maxWidth: "640px" }}>
        <h3 style={{ fontSize: "1.05rem", marginBottom: "0.4rem" }}>Rooms being set up</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--color-ink-muted)", marginBottom: "1rem" }}>
          Access is decided by what you hold and the roles you've earned:
        </p>
        <table className="data-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Who can join</th>
            </tr>
          </thead>
          <tbody>
            {ROOMS.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
