import { useMemo } from "react";
import { Link, useParams } from "react-router";
import DOMPurify from "dompurify";
import { useParagraphPosts } from "@/hooks/useParagraphPosts";
import { RESEARCH_LINKS } from "@/lib/links";

// Open any links inside rendered posts safely in a new tab.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.nodeName === "A") {
    (node as Element).setAttribute("target", "_blank");
    (node as Element).setAttribute("rel", "noopener noreferrer");
  }
});

export default function PostPage() {
  const { slug } = useParams();
  const { data: posts, isLoading, isError } = useParagraphPosts();
  const post = useMemo(() => posts?.find((p) => p.slug === slug), [posts, slug]);

  const cleanHtml = useMemo(
    () => (post ? DOMPurify.sanitize(post.contentHtml, { ADD_ATTR: ["target"] }) : ""),
    [post]
  );

  const backLink = (
    <Link
      to="/research"
      style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", textDecoration: "none" }}
    >
      ← Research Library
    </Link>
  );

  if (isLoading) {
    return (
      <div style={{ maxWidth: "70ch" }}>
        {backLink}
        <div className="skeleton" style={{ height: "2rem", width: "70%", margin: "1.5rem 0 1rem" }} />
        <div className="skeleton" style={{ height: "260px", marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ height: "1rem", marginBottom: "0.6rem" }} />
        <div className="skeleton" style={{ height: "1rem", width: "92%", marginBottom: "0.6rem" }} />
        <div className="skeleton" style={{ height: "1rem", width: "96%" }} />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div style={{ maxWidth: "70ch" }}>
        {backLink}
        <p style={{ marginTop: "1.5rem", color: "var(--color-ink-muted)" }}>
          {isError ? "That post couldn't be loaded." : "Post not found."}{" "}
          <a href={RESEARCH_LINKS.paragraph} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary-hover)" }}>
            Browse on Paragraph ↗
          </a>
        </p>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: "70ch", margin: "0 auto" }}>
      {backLink}

      <header style={{ margin: "1.25rem 0 1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.6rem" }}>
          {post.dateLabel && <span className="text-label">{post.dateLabel}</span>}
          {post.categories.slice(0, 3).map((c) => (
            <span key={c} className="badge">
              {c}
            </span>
          ))}
        </div>
        <h1 className="text-display" style={{ fontSize: "2.25rem" }}>
          {post.title}
        </h1>
      </header>

      {post.image && (
        <img
          src={post.image}
          alt=""
          style={{ width: "100%", maxHeight: "420px", objectFit: "cover", borderRadius: "3px", marginBottom: "1.75rem" }}
        />
      )}

      <div className="prose-research" dangerouslySetInnerHTML={{ __html: cleanHtml }} />

      <footer style={{ marginTop: "2.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        {backLink}
        <a
          href={post.link}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: "0.85rem", color: "var(--color-ink-muted)", textDecoration: "none" }}
        >
          View on Paragraph ↗
        </a>
      </footer>
    </article>
  );
}
