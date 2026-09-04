export const metadata = {
  title: "개인정보처리방침 | 퍼스트 바이럴",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">개인정보처리방침</h1>
      <p className="mt-3 text-sm text-neutral-400">시행일자: 2026년 9월 4일</p>

      <p className="mt-6 text-sm leading-relaxed text-neutral-600">
        비즈니스 스토리(이하 &ldquo;회사&rdquo;)는 &ldquo;퍼스트 바이럴&rdquo; 서비스(이하 &ldquo;서비스&rdquo;)를
        이용하는 회원 및 신청자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관계 법령을 준수하고 있습니다.
        회사는 개인정보처리방침을 통해 회사가 수집하는 개인정보의 항목, 이용 목적, 보유 및 이용 기간, 제3자
        제공 및 처리위탁 여부 등을 안내드립니다.
      </p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-neutral-700">
        <article>
          <h2 className="text-base font-bold text-neutral-900">1. 수집하는 개인정보의 항목 및 수집방법</h2>
          <p className="mt-2 font-semibold text-neutral-800">가. 수집 항목</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원가입 시: 이메일 주소, 비밀번호(암호화 저장). 구글 계정으로 가입 시 구글이 제공하는 이메일 주소.</li>
            <li>무료 자료 신청 / 상담 신청 시: 이름, 휴대전화번호, 이메일 주소, 신청 자료 종류, 상담 내용(입력한 경우).</li>
            <li>서비스 이용 과정에서 자동 수집되는 정보: 접속 로그, 방문 일시, 서비스 이용 기록, 기기·브라우저 정보(Vercel Analytics를 통한 통계성 정보).</li>
          </ul>
          <p className="mt-3 font-semibold text-neutral-800">나. 수집 방법</p>
          <p className="mt-2">
            홈페이지 내 회원가입 및 로그인, 무료 자료 신청 폼, 상담 신청 폼을 통한 이용자의 직접 입력, 구글
            소셜 로그인 연동 과정에서의 수집.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">2. 개인정보의 수집 및 이용목적</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 로그인 유지</li>
            <li>무료 자료 및 특강 신청에 따른 자료 발송, 신청 확인 안내 메일 발송</li>
            <li>1:1 컨설팅, 교육, 콘텐츠 대행 등 상담 신청에 대한 응대 및 서비스 제공</li>
            <li>서비스 이용 관련 공지사항 전달, 문의사항 처리</li>
            <li>서비스 이용 통계 분석을 통한 서비스 개선</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">3. 개인정보의 보유 및 이용기간</h2>
          <p className="mt-2">
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
            단, 아래의 정보에 대해서는 명시한 사유로 명시한 기간 동안 보존합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>회원 탈퇴 시: 관련 법령 위반에 따른 수사·조사 등이 진행 중인 경우 해당 절차 종료 시까지 보관</li>
            <li>
              전자상거래 등에서의 소비자보호에 관한 법률에 따른 보존: 계약 또는 청약철회 등에 관한 기록
              5년, 대금결제 및 재화 등의 공급에 관한 기록 5년, 소비자 불만 또는 분쟁처리에 관한 기록 3년
            </li>
            <li>통신비밀보호법에 따른 로그인 기록 등 통신사실확인자료 3개월</li>
          </ul>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">4. 개인정보의 제3자 제공</h2>
          <p className="mt-2">
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로
            합니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>이용자가 사전에 제3자 제공에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">5. 개인정보처리의 위탁</h2>
          <p className="mt-2">
            회사는 원활한 서비스 제공을 위하여 아래와 같이 개인정보 처리업무를 외부 전문업체에 위탁하고
            있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고
            있습니다.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-black/5">
            <table className="w-full min-w-[480px] border-collapse text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-4 py-2 font-semibold">수탁업체</th>
                  <th className="px-4 py-2 font-semibold">위탁업무 내용</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                <tr>
                  <td className="px-4 py-2 align-top">Supabase Inc.</td>
                  <td className="px-4 py-2 align-top">신청 정보 및 회원 계정 정보의 데이터베이스 저장·관리, 로그인 인증</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 align-top">Resend</td>
                  <td className="px-4 py-2 align-top">신청 확인 메일, 자료 발송 메일 등 이메일 발송</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 align-top">Vercel Inc.</td>
                  <td className="px-4 py-2 align-top">웹사이트 호스팅 및 서비스 이용 통계 분석</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 align-top">Google LLC</td>
                  <td className="px-4 py-2 align-top">구글 소셜 로그인 인증</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">6. 정보주체의 권리·의무 및 행사방법</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 회원 탈퇴 및 수집·이용 동의 철회를 요청할 수 있습니다.</li>
            <li>개인정보 조회, 정정, 삭제, 처리정지 요청은 아래 &ldquo;개인정보 보호책임자&rdquo;에게 이메일로 연락하시면 지체 없이 조치합니다.</li>
            <li>이용자가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">7. 개인정보의 파기절차 및 방법</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</li>
            <li>전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">8. 개인정보의 안전성 확보조치</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>비밀번호의 암호화 저장 및 관리</li>
            <li>개인정보에 대한 접근 권한을 최소한의 인원으로 제한</li>
            <li>개인정보가 저장되는 데이터베이스에 대한 접근 통제 및 전송구간 암호화(HTTPS)</li>
          </ul>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">9. 쿠키(Cookie)의 운영</h2>
          <p className="mt-2">
            회사는 서비스 이용 통계 분석 및 로그인 상태 유지를 위하여 쿠키 및 브라우저 로컬 저장소를 사용할
            수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 로그인이 필요한
            일부 서비스 이용에 어려움이 있을 수 있습니다.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">10. 개인정보 보호책임자</h2>
          <p className="mt-2">
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리
            및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>성명: 심정혁</li>
            <li>직책: 대표</li>
            <li>이메일: tlawjdgur11@naver.com</li>
          </ul>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">11. 고지의 의무</h2>
          <p className="mt-2">
            이 개인정보처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용이 추가·삭제 및 수정될 수 있으며,
            변경 시 서비스 내 공지사항을 통해 고지합니다.
          </p>
        </article>

        <div className="border-t border-black/5 pt-6 text-xs text-neutral-400">
          <p>상호: 비즈니스 스토리 | 대표: 심정혁</p>
          <p className="mt-1">주소: 서울 서초구 서초대로 243 서현빌딩 4층</p>
          <p className="mt-1">사업자등록번호: 781-40-01405 | 통신판매업신고번호: 제2026-서울광진-0278호</p>
          <p className="mt-1">이메일: tlawjdgur11@naver.com</p>
        </div>
      </div>
    </section>
  );
}
