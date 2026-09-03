import { getLeads } from "@/lib/supabase";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const leads = await getLeads();
  return <AdminDashboard leads={leads} />;
}
