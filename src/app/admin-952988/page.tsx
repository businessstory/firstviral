import { getLeads, getAuthUsers, getTrackedAccounts } from "@/lib/supabase";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const [leads, users, trackedAccounts] = await Promise.all([
    getLeads(),
    getAuthUsers(),
    getTrackedAccounts(),
  ]);
  return <AdminDashboard leads={leads} users={users} trackedAccounts={trackedAccounts} />;
}
