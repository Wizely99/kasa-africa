import ForumPost, { ForumPostPageProps } from "@/features/forum-posts/pages/forum-post";

export default function ForumPostPage({ params }: ForumPostPageProps) {
  return <ForumPost params={params} />;
}
