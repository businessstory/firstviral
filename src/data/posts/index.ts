// 뉴스레터 상세 글 등록부.
// 새 글을 추가하려면: 1) 이 폴더에 새 파일 만들기 (reels-trend-0824.ts 참고)
//                     2) 아래 postsBySlug 에 등록
//                     3) src/data/newsletter-posts.ts 목록에도 카드 추가 (url: "/48/그-slug")
import { reelsTrend0824 } from "./reels-trend-0824";

export const postsBySlug = {
  [reelsTrend0824.slug]: reelsTrend0824,
};

export type PostSlug = keyof typeof postsBySlug;
