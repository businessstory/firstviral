// Basic Auth 헤더가 관리자 자격증명과 일치하는지 확인. proxy.ts와 동일한 로직을
// API 라우트 안에서도 재사용할 때 씁니다 (예: 크론 라우트를 관리자 브라우저에서 직접 호출할 때).
export function isAdminBasicAuth(authHeader: string | null): boolean {
  if (!authHeader?.startsWith("Basic ")) return false;

  const decoded = atob(authHeader.slice(6));
  const separatorIndex = decoded.indexOf(":");
  const user = decoded.slice(0, separatorIndex);
  const pass = decoded.slice(separatorIndex + 1);

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;

  return Boolean(expectedUser && expectedPass && user === expectedUser && pass === expectedPass);
}
