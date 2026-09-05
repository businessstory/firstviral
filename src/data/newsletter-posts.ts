// 예전에 코드에 직접 등록하던 뉴스레터 목록입니다. 지금은 관리자 페이지
// (/admin-952988/newsletter)에서 작성한 글이 자동으로 /48에 노출되니
// 이 파일에 새로 추가하실 필요 없어요. 하위 호환을 위해 빈 배열로 남겨둡니다.

export type NewsletterPost = {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  url: string;
};

export const newsletterPosts: NewsletterPost[] = [];
