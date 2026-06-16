/* Bittrees Research publishes on Paragraph. We pull the publication's RSS
   directly in the browser (the feed sends `access-control-allow-origin: *`)
   and render posts natively — no third-party embed, no server proxy. */

import { PARAGRAPH_SLUG } from "@/lib/links";

export interface ParagraphPost {
  title: string;
  link: string;
  slug: string;
  guid: string;
  date: string; // ISO
  dateLabel: string;
  excerpt: string;
  contentHtml: string;
  image?: string;
  categories: string[];
}

const FEED_URL = `https://api.paragraph.com/blogs/rss/${PARAGRAPH_SLUG}`;

function text(item: Element, tag: string): string {
  const el = item.getElementsByTagName(tag)[0];
  return el?.textContent?.trim() ?? "";
}

/** `content:encoded` is namespaced; match by qualified name, then by local name. */
function encodedContent(item: Element): string {
  const byQualified = item.getElementsByTagName("content:encoded")[0];
  if (byQualified?.textContent) return byQualified.textContent;
  for (const node of Array.from(item.children)) {
    if (node.nodeName === "content:encoded" || node.localName === "encoded") {
      return node.textContent ?? "";
    }
  }
  return "";
}

function slugFromLink(link: string): string {
  return link.split("/").filter(Boolean).pop() ?? link;
}

export async function fetchParagraphPosts(): Promise<ParagraphPost[]> {
  const res = await fetch(FEED_URL, { headers: { Accept: "application/rss+xml, text/xml" } });
  if (!res.ok) throw new Error(`Paragraph feed returned ${res.status}`);
  const xml = await res.text();
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Could not parse the research feed");

  return Array.from(doc.getElementsByTagName("item")).map((item) => {
    const link = text(item, "link");
    const pub = text(item, "pubDate");
    const dateObj = pub ? new Date(pub) : null;
    const valid = dateObj && !Number.isNaN(dateObj.getTime());
    const enclosure = item.getElementsByTagName("enclosure")[0];
    const image = enclosure?.getAttribute("url") || undefined;
    const categories = Array.from(item.getElementsByTagName("category"))
      .map((c) => c.textContent?.trim() ?? "")
      .filter(Boolean);

    return {
      title: text(item, "title"),
      link,
      slug: slugFromLink(link),
      guid: text(item, "guid") || link,
      date: valid ? dateObj!.toISOString() : "",
      dateLabel: valid
        ? dateObj!.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
        : "",
      excerpt: text(item, "description"),
      contentHtml: encodedContent(item) || text(item, "description"),
      image,
      categories,
    };
  });
}
