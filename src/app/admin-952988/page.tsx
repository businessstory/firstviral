import { getLeads, getAuthUsers } from "@/lib/supabase";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const [leads, users] = await Promise.all([getLeads(), getAuthUsers()]);
  return <AdminDashboard leads={leads} users={users} />;
}
