// leadMagnet 키 → 사람이 읽을 이름 매핑. 새 자료 추가하면 여기에도 등록하세요.
export const LEAD_MAGNET_LABELS: Record<string, string> = {
  free_pdf_selfcheck: "인스타그램 자가진단 템플릿 (무료 PDF)",
  free_course: "인스타그램 수익화 무료 강의",
  threads_pdf: "쓰레드 성장 무료 PDF",
  template_selfcheck: "인스타그램 자가진단 템플릿 (노마드 템플릿)",
  template_vod: "인스타그램 수익화 강의 VOD",
};

export function leadMagnetLabel(key: string): string {
  return LEAD_MAGNET_LABELS[key] ?? key;
}
