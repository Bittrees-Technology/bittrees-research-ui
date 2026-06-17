interface Props {
  label: string;
  title: string;
  intro?: string;
  /** Center the label, title, and intro (default left-aligned). */
  center?: boolean;
}

/** Consistent page heading: small uppercase label, serif display title, optional intro. */
export function PageHeader({ label, title, intro, center }: Props) {
  return (
    <header style={{ marginBottom: "1.75rem", textAlign: center ? "center" : undefined }}>
      <span className="text-label" style={{ color: "var(--color-primary-hover)" }}>
        {label}
      </span>
      <h1 className="text-display" style={{ margin: "0.35rem 0 0.5rem" }}>
        {title}
      </h1>
      {intro && (
        <p style={{ fontSize: "1rem", color: "var(--color-ink-muted)", maxWidth: "62ch", margin: center ? "0 auto" : 0 }}>
          {intro}
        </p>
      )}
    </header>
  );
}
