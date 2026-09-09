# 잡이쓰 랜딩 리디자인

## 디자인 방향

“내 경험을 이해한 기회가 먼저 도착한다”는 제품 경험을 중심에 두었습니다. 첫 화면은 큰 한국어 타이포그래피와 종이 질감의 봉투 이미지로 시선을 모으고, 별도의 편지 체험에서 그 기회가 왜 연결되는지 직접 읽습니다. 반복되는 디바이스 목업 대신 웹에서 작동하는 제품 순간을 구성했습니다.

- 컬러: 브랜드 블루 `#ADD6FF`, 배경 `#EFF6FD`, 잉크 `#20354B`, 버튼 `#243B52`, 보조 텍스트 `#718090`, 종이 `#FFFFFF`.
- 서체: 한국어 Pretendard, 영문 워드마크 DM Sans, 짧은 편지 인사 Georgia.
- 구성: 헤더 → 경험/기회 히어로 → 입력 맥락 바 → 선택형 편지 → 세 단계 사용법 → 경험 누적 → FAQ → 시작 CTA.
- 모바일: 중앙 정렬 히어로, 가로 선택 탭, 세로 편지, 전체 화면 내 공간.
- 상호작용: 편지의 연결 출처 변경, 리포트 펼치기, 공고 저장, 실제 프로필과 AI API 흐름. 탭의 화살표/Home/End 키, 네이티브 dialog 포커스 제어와 Escape 닫기, reduced motion, 확대 허용.

## 기능 연결

| 제품 기능 | 구현 |
| --- | --- |
| 적은 정보로 시작 | 경험 한 줄 또는 관심사 선택만으로 분석 요청 |
| 프로필과 자료 | 이름, 관심사, 활동, 학력/교육, 자격증, 포트폴리오, GitHub 등의 링크 추가/삭제 |
| 직무 방향 탐색 | 기존 `/api/ai/analyze-experience`, 가설 근거와 선택한 탐색 방향 |
| 기회 도착 | 기존 6개 예시 공고의 우편함, 도착 이유, 보관 상태 |
| 적합 설명 | 강점, 확인할 점, 경험 근거, 다음 행동, 기존 `/api/ai/match-report` 재분석 |
| 피드백 | 저장/넘기기/되돌리기, 기존 `/api/ai/tune-hypothesis` 호출 |
| 점진적 분석 | 경험 추가 후 다시 분석, 관심 방향 유지 |
| 상태 유지 | 버전이 있는 로컬 저장소, 새로고침 복원, 저장 실패 안내 |

첫 화면 편지에서 저장한 공고도 내 공간의 저장한 공고에 나타납니다. 과거 화면을 Git에서 복구하지 않았으며, 기존 데이터와 API를 사용했습니다.

## 현재 서버의 실제 범위

- 이 환경에는 Gemini 키가 없습니다. 기존 서버의 예시 응답을 사용하며 화면에 예시 분석임을 표시합니다. 실제 모델 호출은 검증하지 않았습니다.
- 채용공고는 저장소의 예시 데이터입니다. 실시간 수집/지원 기능은 없습니다.
- 기존 피드백 API는 요청을 수신하고 확인 응답을 반환합니다. 추천 모델의 영속적인 재학습은 구현되어 있지 않습니다.
- 정보는 해당 브라우저에 보관됩니다. 계정 인증, 서버 계정 동기화, 실제 알림 발송은 제공하지 않습니다.
- 링크는 텍스트 단서로 전달합니다. URL 내용 크롤링이나 파일 업로드는 제공하지 않습니다.

## 이미지 생성 기록

Built-in `image_gen`을 사용했습니다. 사용 에셋: `public/images/jobiss-envelope.webp` (1536×1024, 63,740 bytes). 원본 생성 파일은 Codex generated_images에 유지하고, 웹에서 사용하는 파일은 저장소에 포함했습니다. WebP 압축 및 CSS 경계 마스킹으로 배경에 통합했습니다.

최종 생성 프롬프트:

> Use case: stylized-concept. Asset type: hero art for jobiss., a sophisticated Korean career discovery website. Create a premium photorealistic 3D studio render of a single large open light powder blue paper envelope (#ADD6FF), a thick white letter card halfway emerging, diagonally tilted very slightly counterclockwise, front view with subtle perspective from above. Envelope has beautiful precise triangular folded paper seams, substantial matte tactile paper, blue interior flap opened upward behind the white letter. The letter has just the small lowercase dark navy wordmark 'jobiss.' in its upper left corner, otherwise blank. One small pale blue postage stamp with a minimalist abstract four-point sparkle in top right of letter. Main object fills 80% of composition, centered; entire object fully visible. Backdrop perfectly uniform very pale cool blue #EFF6FD, with natural very soft diffuse shadow below envelope creating a floating effect. Refined contemporary product photography, crisp physical paper edge detail, warm daylight from upper left, no cartoon style, no plastic, no extraneous floating icons or props, no UI, no other text. Landscape 3:2 composition.
