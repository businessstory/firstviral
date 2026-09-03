// 뉴스레터 페이지(/48)에 보여줄 글 목록. 새 뉴스레터를 보낼 때마다 여기에 항목을 하나 추가하면 됩니다.
//
// id: 아무 고유 문자열이나 (예: "3", "2026-09-02")
// title: 뉴스레터 제목
// thumbnail: 썸네일 이미지 경로. public/newsletter/ 폴더에 이미지를 넣고 "/newsletter/파일명.jpg" 로 지정하세요.
// date: 발송일 (예: "2026.09.02")
// url: 클릭 시 이동할 링크. 사이트 안에 상세페이지를 만들었다면 "/48/글-slug", 아니면 스티비 링크로.

export type NewsletterPost = {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  url: string;
};

export const newsletterPosts: NewsletterPost[] = [
  {
    id: "reels-trend-0824",
    title: "(8월 4주차) 릴스 트렌드 분석하기",
    thumbnail: "https://placehold.co/400x300/0b2b21/ffffff?text=Reels+Trend+Top10",
    date: "2026.08.24",
    url: "/48/reels-trend-0824",
  },
];
