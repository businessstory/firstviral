import NaverBlogAdmin from "@/components/NaverBlogAdmin";
import { naverKeysStatus } from "@/lib/naver/keywords";

export const dynamic = "force-dynamic";

export default function BlogAdminPage() {
  return <NaverBlogAdmin keys={naverKeysStatus()} />;
}
