# jobiss. — 잡이쓰

경험을 통해 직무 가능성을 탐색하고, 연결의 이유가 담긴 기회를 읽는 한국어 커리어 서비스의 랜딩페이지입니다.

## 실행

```sh
npm install
npm run dev
```

기본 포트는 3000입니다. 다른 포트는 `PORT=3107 npm run dev`로 지정할 수 있습니다.

```sh
npm run lint
npm run build
npm start
```

`npm start`는 빌드된 페이지를 운영 모드로 제공합니다. AI 키는 `.env.example`을 참고하여 로컬 `.env`에 설정할 수 있습니다. 키가 없으면 기존 서버의 예시 분석을 사용합니다. 채용공고는 체험용 데이터입니다.

## 브라우저 통합 검증

```sh
npx playwright install chromium
PORT=3107 npm run dev
# 별도 터미널에서
npm run test:e2e
```

다른 서버 주소는 `BASE_URL=http://localhost:3000 npm run test:e2e`로 지정하세요. 검증은 격리된 브라우저에서 실행되며, 편지 전환, 정보 입력, 분석, 저장/넘기기, 복원, 재분석, API 오류 안내, 320–1440px 레이아웃을 확인합니다. 스크린샷은 `tests/screenshots/`에 생성됩니다.

- [디자인 방향·기능 연결·이미지 생성 기록](docs/design-notes.md)
- [검증 결과](docs/verification.md)
