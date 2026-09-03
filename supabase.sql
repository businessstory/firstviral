-- 무료 자료 신청(리드) 저장 테이블
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  lead_magnet TEXT NOT NULL,            -- 어떤 자료를 신청했는지 (free_pdf_selfcheck / free_course / threads_pdf / template_selfcheck / template_vod)
  status TEXT NOT NULL DEFAULT 'pending', -- pending(대기중) / done(완료)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이미 leads 테이블을 만든 상태라면(재실행 시 CREATE TABLE은 에러가 나므로) 아래 줄만 실행하세요.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 누구나(사이트 방문자) 신청 폼을 통해 insert만 가능하도록 허용
CREATE POLICY "Anyone can insert" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- 이메일 자동 발송 (DB 트리거)
-- leads 테이블에 새 행이 저장되는 순간, 관리자에게는 즉시,
-- 신청자에게는 1분 뒤 확인 메일을 Resend로 자동 발송합니다.
-- ============================================================

-- 1. 외부 HTTP 호출을 위한 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Resend API 키를 Vault(암호화 저장소)에 보관 (평문으로 테이블/함수에 남기지 않기 위함)
--    이미 등록했다면 이 줄은 에러가 나도 무시하고 넘어가면 됩니다.
--    아래 'YOUR_RESEND_API_KEY' 자리에 실제 발급받은 Resend API 키를 붙여넣고 실행하세요.
SELECT vault.create_secret('YOUR_RESEND_API_KEY', 'resend_api_key');

-- 3. 트리거 함수: leads에 행이 추가되면 실행됨
CREATE OR REPLACE FUNCTION public.handle_new_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resend_key TEXT;
  admin_email TEXT := 'tlawjdgur11@naver.com';
  magnet_label TEXT;
  resource_html TEXT;
BEGIN
  SELECT decrypted_secret INTO resend_key
  FROM vault.decrypted_secrets
  WHERE name = 'resend_api_key';

  magnet_label := CASE NEW.lead_magnet
    WHEN 'free_pdf_selfcheck' THEN '인스타그램 자가진단 템플릿 (무료 PDF)'
    WHEN 'free_course' THEN '인스타그램 수익화 무료 강의'
    WHEN 'threads_pdf' THEN '쓰레드 성장 무료 PDF'
    WHEN 'template_selfcheck' THEN '인스타그램 자가진단 템플릿 (노마드 템플릿)'
    WHEN 'template_vod' THEN '인스타그램 수익화 강의 VOD'
    ELSE NEW.lead_magnet
  END;

  -- 리드 자석별 실제 자료 링크 (버튼으로 노출)
  resource_html := CASE NEW.lead_magnet
    WHEN 'free_pdf_selfcheck' THEN
      '<a href="https://drive.google.com/file/d/1b5ogMvOt6gGLBqfRK1YKN1C7BOTz-pdQ/view?usp=sharing" target="_blank" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2f8f5b;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;">자가진단 템플릿 받기</a>'
    WHEN 'free_course' THEN
      '<a href="https://www.youtube.com/watch?v=YtbnylHKvHI" target="_blank" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#2f8f5b;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:bold;">무료 강의 보러 가기</a>'
    WHEN 'threads_pdf' THEN
      '<p style="margin-top:16px;color:#666;">자료를 준비 중이에요. 완성되는 대로 이 이메일로 바로 보내드릴게요!</p>'
    ELSE ''
  END;

  -- 관리자 즉시 알림
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'First Viral <onboarding@resend.dev>',
      'to', jsonb_build_array(admin_email),
      'subject', '새 신청 도착 - ' || magnet_label,
      'html', '<p>이름: ' || NEW.name || '</p><p>이메일: ' || NEW.email || '</p><p>연락처: ' || NEW.phone || '</p>'
    )
  );

  -- 신청자에게 1분 뒤 확인 메일
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'First Viral <onboarding@resend.dev>',
      'to', jsonb_build_array(NEW.email),
      'subject', '[퍼스트 바이럴] 신청이 접수됐어요!',
      'html', '<p>안녕하세요 ' || NEW.name || '님,</p><p><strong>' || magnet_label || '</strong> 신청이 접수됐어요!</p>' || resource_html,
      'scheduledAt', 'in 1 min'
    )
  );

  RETURN NEW;
END;
$$;

-- 4. 트리거 등록
DROP TRIGGER IF EXISTS on_lead_created ON leads;
CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_lead();
