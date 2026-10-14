// 상위 글 분석 결과를 바탕으로, Claude/ChatGPT에 붙여 넣을 "상위노출용 블로그 글쓰기 지시문"을 만든다.
import type { KeywordAnalysis } from "./analysis";

const roundUp = (n: number, step: number) => Math.ceil(n / step) * step;
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export function buildWritingPrompt(a: KeywordAnalysis): string {
  const s = a.summary;
  const kw = a.keyword;
  // 상위 글 중간값보다 10% 정도 더 충실하게
  const chars = clamp(roundUp(s.chars * 1.1, 100), 1500, 4000);
  const images = clamp(s.images || 8, 6, 15);
  const exact = clamp(s.keywordExact || 4, 3, 7);
  const sections = clamp(Math.round(chars / 450), 4, 7);
  const titleLen = clamp(s.titleLength || 32, 25, 40);
  const subs = a.subKeywords.slice(0, 10);
  const tags = [kw.replace(/\s+/g, ""), ...a.popularTags.filter((t) => t !== kw.replace(/\s+/g, ""))].slice(0, 6);

  return `너는 네이버 블로그 상위노출 전문가이자, 실제 경험을 진솔하게 쓰는 블로거야.
아래 [분석 결과]와 [작성 규칙]을 지켜서 "${kw}" 키워드로 네이버 블로그 글을 써 줘.

[분석 결과: 지금 "${kw}" 네이버 블로그 1~5위 글의 공통점]
- 제목 길이: 약 ${s.titleLength}자, 5개 중 ${s.titleStartsWithKeyword}개가 키워드로 제목을 시작
- 본문: 공백 제외 약 ${s.chars.toLocaleString()}자, 사진 약 ${s.images}장, 인용구 ${s.quotes}개
- 키워드 "${kw}": ${s.keywordExact ? `그대로 약 ${s.keywordExact}회 반복` : "그대로 쓰기보다 단어를 나눠서 사용"}, 5개 중 ${s.keywordInIntro}개가 첫 부분에 키워드 사용
- 태그: 약 ${s.tags}개
- 상위 글은 평균 ${s.freshDays}일 전에 올라온 최신 글
${a.titlePatterns.length ? `- 제목 패턴: ${a.titlePatterns.join(", ")}` : ""}
- 상위 글에 공통으로 나온 서브 키워드: ${subs.join(", ") || "(없음)"}

[작성 규칙]
1. 제목: 3개를 제안해 줘. "${kw}"로 시작하고, ${titleLen - 5}~${titleLen + 5}자. 읽는 사람이 얻는 이득이 보이게(방법·숫자·경험 중 하나).
2. 도입부: 첫 두 문장 안에 "${kw}"를 자연스럽게 넣고, 독자의 고민에 공감하며 시작해.
3. 본문 길이: 공백 제외 약 ${chars.toLocaleString()}자.
4. 구성: 소제목 ${sections}개로 나누고, 소제목 앞에 "■"를 붙여. 소제목 중 1~2개에는 서브 키워드를 넣어.
5. 키워드: "${kw}"를 그대로 ${exact}회 정도 쓰고, 나머지는 단어를 나눠 자연스럽게 써. 같은 문장에 억지로 반복하지 마.
6. 서브 키워드: ${subs.slice(0, 8).join(", ") || "관련 단어"}를 본문 곳곳에 자연스럽게 녹여.
7. 사진: 총 ${images}장. 사진이 들어갈 자리마다 한 줄로 [사진 N: 어떤 사진인지 + 사진 설명 문구]를 써 줘.
   - 실제 화면 캡처, 직접 찍은 사진 위주로 제안해 (예: 인스타그램 인사이트 화면, 작업 과정, 전후 비교)
   - 사진 앞뒤에는 그 사진을 설명하는 문장을 1~2줄 넣어
8. 중간에 핵심을 정리한 인용구를 2개 넣고, 인용구 앞에는 "> "를 붙여.
9. 경험: 내가 실제로 겪은 내용이 들어가야 할 자리는 지어내지 말고 [직접 경험: 무엇을 쓰면 좋은지] 로 비워 둬.
10. 마무리: 핵심 3줄 요약 + 독자가 다음에 할 행동 1가지.
11. 태그: 마지막에 #태그 5~6개 (추천: ${tags.map((t) => `#${t}`).join(" ")})

[꼭 지킬 것]
- 광고·협찬을 받은 글이라면 첫 줄과 마지막 줄에 "소정의 원고료를 받아 작성했습니다"처럼 반드시 표기해.
- 다른 블로그 문장을 베끼지 말고, 과장된 표현("무조건", "100% 보장")은 쓰지 마.
- 짧은 문장, 2~3줄마다 줄바꿈, 모바일에서 읽기 편하게.

[출력 형식]
1) 제목 후보 3개
2) 본문 (소제목 ■, 사진 [사진 N: …], 인용구 > …, 경험 [직접 경험: …] 표시 포함)
3) 태그`;
}
