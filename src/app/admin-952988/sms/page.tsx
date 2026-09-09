import { getLeads } from "@/lib/supabase";
import BroadcastSmsForm from "@/components/BroadcastSmsForm";

export default async function SmsPage() {
  const leads = await getLeads();
  return <BroadcastSmsForm leads={leads} />;
}
