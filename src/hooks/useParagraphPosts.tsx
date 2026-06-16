import { useQuery } from "@tanstack/react-query";
import { fetchParagraphPosts, type ParagraphPost } from "@/lib/paragraph";

/** Cached fetch of the Bittrees Research publication (Paragraph RSS). */
export function useParagraphPosts() {
  return useQuery<ParagraphPost[]>({
    queryKey: ["paragraph", "posts"],
    queryFn: fetchParagraphPosts,
    staleTime: 1000 * 60 * 30, // 30 min — feed is cached an hour upstream
    retry: 1,
  });
}
