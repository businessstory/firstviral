# 릴스 트렌드 대량 스크래퍼 (instagrapi)

Apify 대신 인스타그램에 직접 로그인해서 데이터를 가져오는 **완전 무료** 방식입니다.
Vercel(이 프로젝트의 웹사이트)과는 별개로, **항상 켜져 있는 서버 1대**에서 이 폴더를 돌려야 합니다.

카테고리당 목표 2,000개 × 5개 카테고리 = **총 1만 개**를 목표로 하되,
계정 정지 위험을 낮추기 위해 **한 번에 조금씩, 아주 오랫동안(며칠~몇 주)** 채워나가는 방식입니다.
"오늘 당장 1만 개"는 불가능하고, 그렇게 하면 반드시 계정이 차단됩니다.

---

## 1. 사용자가 직접 할 일

### 1-1. 서브(버리는) 인스타그램 계정 만들기

- 실제 사업 계정과 **절대 다른**, 스크래핑 전용 새 계정을 만드세요.
- 만들자마자 바로 자동화에 쓰지 마세요. **3~5일 정도** 사람처럼 로그인해서 피드 둘러보기, 좋아요 몇 개, 팔로우 몇 개 등 자연스러운 활동을 먼저 하고 "웜업"을 시켜주세요. 바로 자동화부터 돌리면 인스타그램이 즉시 의심하고 차단할 확률이 높습니다.
- 전화번호 인증을 걸어두면 정지 확률이 낮아집니다.
- 2단계 인증(OTP)은 켜지 마세요 — 자동 로그인이 막힙니다.

### 1-2. Oracle Cloud 무료 서버(VM) 만들기

Oracle Cloud의 "Always Free" 티어는 평생 무료로 서버 1대를 계속 켜둘 수 있어요.

1. https://www.oracle.com/cloud/free/ 접속 → 회원가입 (신용카드 등록은 필요하지만 무료 한도 내에서는 과금되지 않아요)
2. 가입 완료 후 콘솔 로그인 → 좌측 메뉴 **Compute → Instances** → **Create Instance**
3. 아래처럼 설정:
   - Image: **Ubuntu 22.04**
   - Shape: **VM.Standard.A1.Flex** (Always Free 대상, 무료)
   - SSH 키: "Generate a key pair for me" 선택 → **Private Key 다운로드 필수** (나중에 접속할 때 필요, 잃어버리면 재발급 안 됨)
4. Create 클릭 → 몇 분 뒤 생성 완료, **Public IP 주소** 복사
5. 아래 정보를 저에게 알려주세요:
   - ✅ Public IP 주소
   - ✅ 다운로드한 private key 파일 경로

### 1-3. Supabase에 SQL 마이그레이션 실행

`supabase.sql` 파일 맨 아래에 새로 추가된 부분(`scraper_state` 테이블, `last_synced_at` 컬럼)을 Supabase SQL Editor에서 실행해주세요. (이미 실행한 부분은 다시 실행해도 안전합니다.)

---

## 2. 서버 접속 후 설정 (제가 안내하는 대로 따라 하시거나, 접속 정보를 주시면 제가 원격으로 설정을 도와드릴 수 있어요)

```bash
# 1) 서버 접속
ssh -i /path/to/private-key.pem ubuntu@서버IP

# 2) 필요한 패키지 설치
sudo apt update && sudo apt install -y python3-venv python3-pip git

# 3) 코드 가져오기 (GitHub 저장소에서)
git clone <이 프로젝트 GitHub 주소>
cd <프로젝트 폴더>/scraper

# 4) 가상환경 설정 및 패키지 설치
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 5) 환경변수 설정
cp .env.example .env
nano .env   # IG_USERNAME, IG_PASSWORD, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 채우기
```

---

## 3. 테스트 실행

```bash
source venv/bin/activate
python discover_accounts.py   # 계정 찾기 (카테고리당 20개씩)
python sync_reels.py          # 찾은 계정들의 릴스 동기화 (30개씩)
```

로그가 정상적으로 찍히고 에러가 없으면 성공입니다. 에러가 나면 로그를 그대로 저에게 알려주세요.

---

## 4. 자동으로 반복 실행되게 cron 설정

```bash
crontab -e
```

아래 두 줄을 추가 (경로는 실제 서버 경로에 맞게 수정):

```cron
# 30분마다 계정 발굴 (카테고리당 20개씩 늘어남)
*/30 * * * * cd /home/ubuntu/<프로젝트>/scraper && venv/bin/python discover_accounts.py >> discover.log 2>&1

# 1시간마다 릴스 동기화 (30개 계정씩 순환)
0 * * * * cd /home/ubuntu/<프로젝트>/scraper && venv/bin/python sync_reels.py >> sync.log 2>&1
```

---

## 5. 현실적으로 기대할 수 있는 것

- **계정 발굴**: 30분마다 카테고리당 20개 → 하루에 카테고리당 약 960개. 카테고리당 2,000개(총 1만)까지 대략 **2~3일** 걸립니다.
- **릴스 동기화**: 1시간마다 30개 계정 → 하루에 720개. 계정이 1만 개가 되면 **전체를 한 바퀴 도는 데 약 14일** 걸립니다. 즉, 특정 계정의 릴스는 최신 상태가 아니라 최대 2주 전 기준일 수 있어요. (계속 이 상태를 유지하며 순환합니다.)
- 더 빠르게 하려면 배치 크기(`DISCOVER_BATCH_PER_CATEGORY`, `SYNC_BATCH_SIZE`)나 cron 주기를 늘리면 되지만, **그만큼 계정 차단 위험도 올라갑니다.** 지금 설정된 값은 안전 쪽으로 보수적으로 잡은 값입니다.

## 6. 그래도 남는 리스크

- 아무리 조심해도 인스타그램이 이 계정을 차단할 가능성은 **0이 아닙니다.** 차단되면 새 서브 계정으로 다시 로그인해서 재시작하면 됩니다 (이미 Supabase에 저장된 데이터는 그대로 남아있어요).
- 매일 한 번씩 `ig_session.json`이 잘 갱신되고 있는지, 로그에 로그인 실패나 `challenge_required` 같은 에러가 없는지 확인하는 걸 추천드려요.
