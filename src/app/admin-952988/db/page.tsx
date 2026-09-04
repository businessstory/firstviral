import { getLeads } from "@/lib/supabase";
import DbAdmin from "@/components/DbAdmin";

export default async function DbAdminPage() {
  const leads = await getLeads();
  return <DbAdmin leads={leads} />;
}
