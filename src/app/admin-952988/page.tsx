import { getLeads, getTrackedAccounts } from "@/lib/supabase";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  const [leads, trackedAccounts] = await Promise.all([getLeads(), getTrackedAccounts()]);
  return <AdminDashboard leads={leads} trackedAccounts={trackedAccounts} />;
}
