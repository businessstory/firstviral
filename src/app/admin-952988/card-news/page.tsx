import { getCardNewsList } from "@/lib/supabase";
import CardNewsAdmin from "@/components/CardNewsAdmin";

export default async function CardNewsAdminPage() {
  const posts = await getCardNewsList();
  return <CardNewsAdmin posts={posts} />;
}
