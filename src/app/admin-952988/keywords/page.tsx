import KeywordResearchAdmin from "@/components/KeywordResearchAdmin";

export const dynamic = "force-dynamic";

export default function KeywordsAdminPage() {
  return <KeywordResearchAdmin configured={Boolean(process.env.YOUTUBE_API_KEY)} />;
}
