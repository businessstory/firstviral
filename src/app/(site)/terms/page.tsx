export const metadata = {
  title: "이용약관 | 퍼스트 바이럴",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-2xl font-extrabold text-neutral-900 md:text-3xl">이용약관</h1>
      <p className="mt-3 text-sm text-neutral-400">시행일자: 2026년 9월 4일</p>

      <div className="mt-10 space-y-10 text-sm leading-relaxed text-neutral-700">
        <article>
          <h2 className="text-base font-bold text-neutral-900">제1조 (목적)</h2>
          <p className="mt-2">
            이 약관은 비즈니스 스토리(이하 &ldquo;회사&rdquo;)가 운영하는 &ldquo;퍼스트 바이럴&rdquo; 웹사이트
            (이하 &ldquo;서비스&rdquo;)에서 제공하는 인스타그램·쓰레드 컨설팅, 교육, 콘텐츠 대행 등 제반
            서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
            목적으로 합니다.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제2조 (용어의 정의)</h2>
          <p className="mt-2">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>&ldquo;서비스&rdquo;란 회사가 제공하는 컨설팅, 교육, 콘텐츠 제작 대행, 무료 자료 제공 등 일체의 서비스를 의미합니다.</li>
            <li>&ldquo;회원&rdquo;이란 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 서비스를 이용하는 자를 말합니다.</li>
            <li>&ldquo;신청자&rdquo;란 회원가입 여부와 관계없이 무료 자료 신청, 상담 신청 등을 통해 개인정보를 제공한 자를 말합니다.</li>
            <li>&ldquo;유료서비스&rdquo;란 회사가 유상으로 제공하는 컨설팅, 교육, 대행 서비스 일체를 말합니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제3조 (약관의 게시와 개정)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 연결화면에 게시합니다.</li>
            <li>
              회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 적용일자 및
              개정사유를 명시하여 적용일자 7일 이전부터 서비스 내 공지합니다. 다만, 회원에게 불리한 내용의
              변경인 경우에는 최소 30일 이전에 공지합니다.
            </li>
            <li>
              회원이 개정약관의 적용에 동의하지 않는 경우 회원은 이용계약을 해지할 수 있으며, 적용일 이후에도
              서비스를 계속 이용하는 경우 개정약관에 동의한 것으로 봅니다.
            </li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제4조 (약관의 해석)</h2>
          <p className="mt-2">
            이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한
            법률, 약관의 규제에 관한 법률 등 관계 법령 및 상관례에 따릅니다.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제5조 (회원가입)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회원가입은 이용자가 약관 내용에 동의하고, 이메일/비밀번호 또는 구글 계정 연동을 통해 가입을 신청함으로써 체결됩니다.</li>
            <li>
              회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수
              있습니다.
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                <li>타인의 명의를 이용하거나 허위 정보를 기재한 경우</li>
                <li>이전에 약관 위반 등의 사유로 이용제한을 받은 사실이 있는 경우</li>
                <li>기타 회사가 정한 이용신청 요건을 충족하지 못한 경우</li>
              </ol>
            </li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제6조 (회원 탈퇴 및 자격 상실)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회원은 언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리합니다.</li>
            <li>
              회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 회사는 회원자격을
              제한 또는 정지, 상실시킬 수 있습니다.
            </li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제7조 (서비스의 제공 및 변경)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사는 인스타그램·쓰레드 계정 진단 및 1:1 컨설팅, 광고 교육, 콘텐츠/릴스 제작 대행, 무료 자료 및 특강 제공 등의 서비스를 제공합니다.</li>
            <li>회사는 운영상, 기술상의 필요에 따라 제공하는 서비스의 내용을 변경할 수 있으며, 이 경우 변경된 서비스의 내용 및 제공일자를 사전에 공지합니다.</li>
            <li>유료서비스 중 일부는 카카오톡 상담, 또는 회사가 지정한 외부 결제 플랫폼(예: 리틀리 등)을 통해 신청 및 결제가 이루어질 수 있으며, 해당 플랫폼의 이용약관이 함께 적용될 수 있습니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제8조 (서비스의 중단)</h2>
          <p className="mt-2">
            회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는
            경우 서비스 제공을 일시적으로 중단할 수 있으며, 이 경우 사전 또는 사후에 공지합니다.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제9조 (유료서비스 이용 및 결제)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>유료서비스의 가격, 결제 방법 및 세부 조건은 각 서비스 소개 페이지에 개별적으로 안내합니다.</li>
            <li>결제는 회사가 지정한 외부 결제대행 플랫폼을 통해 이루어지며, 결제 관련 개인정보 및 결제정보의 처리는 해당 플랫폼의 정책을 따릅니다.</li>
            <li>회사는 서비스 특성상 상담을 통해 별도 견적/일정 조율이 필요한 서비스(교육, 대행 등)에 대해서는 카카오톡 상담 후 개별적으로 계약조건을 안내합니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제10조 (청약철회 및 환불)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회원은 전자상거래 등에서의 소비자보호에 관한 법률이 정하는 바에 따라 계약체결일로부터 7일 이내에 청약철회를 할 수 있습니다. 단, 서비스의 성질상 개별적으로 제공이 시작된 이후에는 청약철회가 제한될 수 있습니다.</li>
            <li>회원의 책임 있는 사유로 서비스가 멸실 또는 훼손된 경우, 회원이 이미 서비스의 일부를 제공받아 그 이익을 얻은 경우 등 관련 법령이 정한 사유에 해당하는 경우 청약철회가 제한될 수 있습니다.</li>
            <li>환불이 결정된 경우, 회사는 결제수단에 따라 관련 법령이 정한 기간 내에 환불을 진행합니다.</li>
            <li>구체적인 환불 규정은 각 서비스 페이지 또는 상담 과정에서 개별 안내되는 내용을 우선 적용합니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제11조 (회원의 의무)</h2>
          <p className="mt-2">회원은 다음 행위를 하여서는 안 됩니다.</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>신청 또는 변경 시 허위내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 무단 변경, 회사의 저작물 등에 대한 무단 복제·배포</li>
            <li>회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>기타 관계 법령에 위배되는 행위</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제12조 (회사의 의무)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사는 관련 법령과 이 약관이 금지하는 행위를 하지 않으며, 지속적·안정적으로 서비스를 제공하기 위해 노력합니다.</li>
            <li>회사는 회원의 개인정보를 본인의 동의 없이 제3자에게 제공하지 않습니다. 다만, 관련 법령에 의한 경우는 예외로 합니다. (자세한 내용은 개인정보처리방침을 따릅니다.)</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제13조 (저작권의 귀속)</h2>
          <p className="mt-2">
            회사가 제작한 콘텐츠, 자료, 강의, 템플릿 등에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.
            회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타
            방법으로 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제14조 (면책조항)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사는 천재지변, 전쟁 및 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.</li>
            <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
            <li>컨설팅, 교육 등 서비스의 특성상 실제 매출·팔로워·조회수 등 성과는 회원의 실행 여부, 시장 상황 등에 따라 달라질 수 있으며, 회사는 특정 성과를 보장하지 않습니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">제15조 (분쟁해결 및 관할법원)</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>회사와 회원 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제소합니다.</li>
            <li>회사와 회원 간에 제기된 전자상거래 분쟁과 관련하여 회원의 피해구제신청이 있는 경우 관계 기관의 조정에 따를 수 있습니다.</li>
          </ol>
        </article>

        <article>
          <h2 className="text-base font-bold text-neutral-900">부칙</h2>
          <p className="mt-2">이 약관은 2026년 9월 4일부터 시행합니다.</p>
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
