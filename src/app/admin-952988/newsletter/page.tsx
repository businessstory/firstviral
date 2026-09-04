import { getNewsletterPosts } from "@/lib/supabase";
import NewsletterAdmin from "@/components/NewsletterAdmin";

export default async function NewsletterAdminPage() {
  const posts = await getNewsletterPosts();
  return <NewsletterAdmin posts={posts} />;
}
