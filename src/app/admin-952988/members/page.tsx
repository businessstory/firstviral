import { getAuthUsers } from "@/lib/supabase";
import MembersAdmin from "@/components/MembersAdmin";

export default async function MembersAdminPage() {
  const users = await getAuthUsers();
  return <MembersAdmin users={users} />;
}
