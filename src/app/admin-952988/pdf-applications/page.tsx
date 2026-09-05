import { getPdfApplications } from "@/lib/supabase";
import PdfApplicationsAdmin from "@/components/PdfApplicationsAdmin";

export default async function PdfApplicationsAdminPage() {
  const applications = await getPdfApplications();
  return <PdfApplicationsAdmin applications={applications} />;
}
