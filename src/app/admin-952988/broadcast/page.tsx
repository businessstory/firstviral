import { getAllRecipientEmails } from "@/lib/supabase";
import BroadcastEmailForm from "@/components/BroadcastEmailForm";

export default async function BroadcastPage() {
  const emails = await getAllRecipientEmails();
  return <BroadcastEmailForm recipientCount={emails.length} />;
}
