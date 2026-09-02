// 결제선생(Payssam) 연동 자리.
// 1. https://guide.payssam.kr 에서 파트너사로 등록 후 API 키 발급
// 2. 발급받은 키를 .env.local 에 PAYSSAM_API_KEY 로 저장
// 3. 아래 createPaymentLink 를 developers.payssam.kr 의 실제 엔드포인트/요청 형식에 맞게 채우기
//    (현재는 공개 API 스펙을 확인할 수 없어 스텁으로 남겨둠)

export async function createPaymentLink(productName: string, amountKrw: number): Promise<string | null> {
  const apiKey = process.env.PAYSSAM_API_KEY;
  if (!apiKey) return null;

  // TODO: 실제 결제선생 청구서/결제링크 생성 API 호출로 교체
  // const res = await fetch("https://api.payssam.kr/v1/invoices", {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ title: productName, amount: amountKrw }),
  // });
  // const data = await res.json();
  // return data.paymentUrl;

  return null;
}
