export const TREND_CATEGORIES = [
  { key: "beauty", label: "뷰티/패션", hashtag: "뷰티" },
  { key: "food", label: "맛집/음식", hashtag: "맛집" },
  { key: "fitness", label: "운동/건강", hashtag: "운동" },
  { key: "influencer", label: "인플루언서", hashtag: "인플루언서" },
  { key: "selfdev", label: "자기개발", hashtag: "자기계발" },
] as const;

export type TrendCategoryKey = (typeof TREND_CATEGORIES)[number]["key"];

export function categoryLabel(key: string): string {
  return TREND_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

export type TrendingReel = {
  id: string;
  category: string;
  post_url: string;
  account_handle: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  like_count: number | null;
  view_count: number | null;
  comment_count: number | null;
  posted_at: string | null;
  scraped_at: string;
};
