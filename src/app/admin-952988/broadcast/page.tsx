import { getAllRecipientEmails } from "@/lib/supabase";
import { getExcelEmails } from "@/lib/emailFile";
import BroadcastEmailForm from "@/components/BroadcastEmailForm";

export default async function BroadcastPage() {
  const [dbEmails, excelEmails] = await Promise.all([getAllRecipientEmails(), getExcelEmails()]);
  return <BroadcastEmailForm dbEmails={dbEmails} excelEmails={excelEmails} />;
}
