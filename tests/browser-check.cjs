const assert = require("node:assert/strict");
require("node:fs").mkdirSync("tests/screenshots", { recursive: true });
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.BASE_URL || "http://localhost:3107";

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    const errors = [];
    const calls = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.url().includes("/api/ai/"))
        calls.push({ url: r.url(), status: r.status() });
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    assert.equal(
      await page
        .locator(".envelope-image")
        .evaluate((el) => el.naturalWidth > 0),
      true,
    );
    await page.getByRole("tab", { name: /활동에서/ }).click();
    assert.match(await page.locator("#letter-panel").innerText(), /32편/);
    await page.getByRole("button", { name: "나와의 연결 자세히 보기" }).click();
    assert.match(
      await page.locator(".inline-report").innerText(),
      /반응이 좋았던 글 3편/,
    );
    await page
      .getByRole("button", { name: "예시 공고 저장", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("button", { name: "예시 공고 저장 취소", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.getByRole("button", { name: "시작하기", exact: true }).click();
    const modal = page.getByRole("dialog");
    await modal
      .getByRole("button", { name: "나의 가능성 발견하기", exact: true })
      .click();
    await modal.getByRole("alert").waitFor();
    assert.match(await modal.getByRole("alert").innerText(), /경험 한 줄/);
    await modal.getByPlaceholder("이름 또는 닉네임").fill("지민");
    await modal
      .getByRole("textbox", {
        name: "해본 일, 좋아하는 일, 앞으로 해보고 싶은 일",
      })
      .fill("블로그 32편을 쓰고 동아리의 브랜드 콘텐츠를 기획했어요.");
    await modal
      .getByRole("button", { name: "글쓰기·콘텐츠", exact: true })
      .click();
    await modal
      .getByRole("textbox", { name: "추가할 경험" })
      .fill("브랜드 캠페인 기획 프로젝트");
    await modal.getByRole("button", { name: "경험 추가", exact: true }).click();
    assert.match(
      await modal.locator(".activity-list").innerText(),
      /브랜드 캠페인 기획 프로젝트/,
    );
    await modal
      .getByRole("button", { name: "나의 가능성 발견하기", exact: true })
      .click();
    await modal.locator(".hypotheses").waitFor();
    await modal.locator(".hypotheses>button").first().click();
    assert.equal(
      await modal
        .locator(".hypotheses>button")
        .first()
        .getAttribute("aria-pressed"),
      "true",
    );
    await modal
      .getByRole("button", { name: "연결된 예시 공고 살펴보기" })
      .click();
    await modal.locator(".inbox-job").first().click();
    assert.equal(await modal.locator(".report-sections section").count(), 4);
    // The landing demo may have already saved this opportunity.
    const saveButton = modal.getByRole("button", {
      name: "관심 공고 저장",
      exact: true,
    });
    if (await saveButton.count()) await saveButton.click();
    await modal
      .getByRole("button", { name: "내가 추가한 경험으로 다시 분석하기" })
      .click();
    await modal.getByRole("status").waitFor();
    assert.match(
      await modal.locator(".report-sections").innerText(),
      /브랜드 캠페인 기획 프로젝트/,
    );
    await modal.getByRole("button", { name: "이번에는 넘기기" }).click();
    await modal.getByRole("button", { name: "우편함으로 되돌리기" }).waitFor();
    await modal.getByRole("button", { name: "넘긴 공고", exact: true }).click();
    assert.equal(await modal.locator(".inbox-job").count(), 1);
    await modal.locator(".inbox-job").first().click();
    await modal.getByRole("button", { name: "우편함으로 되돌리기" }).click();
    await modal.getByRole("button", { name: "이번에는 넘기기" }).waitFor();
    await modal
      .getByRole("button", { name: "관심 공고 저장", exact: true })
      .click();
    await modal
      .getByRole("button", { name: "저장 취소", exact: true })
      .waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "내 우편함", exact: true }).click();
    await modal.getByRole("button", { name: /저장한 공고/ }).click();
    assert.ok((await modal.locator(".inbox-job").count()) > 0);
    await modal.getByRole("button", { name: "내 경험", exact: true }).click();
    assert.equal(
      await modal.getByPlaceholder("이름 또는 닉네임").inputValue(),
      "지민",
    );
    assert.match(
      await modal.locator(".activity-list").innerText(),
      /브랜드 캠페인 기획 프로젝트/,
    );
    // A failed request must preserve the form and make retry available.
    await page.route("**/api/ai/analyze-experience", (route) =>
      route.fulfill({
        status: 500,
        body: "{}",
        contentType: "application/json",
      }),
    );
    await modal
      .getByRole("button", { name: "추가한 경험으로 다시 분석하기" })
      .click();
    await modal.getByRole("alert").waitFor();
    assert.match(await modal.getByRole("alert").innerText(), /다시 시도/);
    assert.equal(
      await modal.getByPlaceholder("이름 또는 닉네임").inputValue(),
      "지민",
    );
    await page.unroute("**/api/ai/analyze-experience");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `Overflow at ${width}`,
      );
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "시작하기", exact: true }).click();
    assert.equal(
      await modal.evaluate((el) => el.scrollWidth > el.clientWidth),
      false,
      "Dialog overflow",
    );
    await modal
      .getByRole("textbox", { name: "추가할 경험" })
      .fill("사용자 인터뷰 5회 진행");
    await modal.getByRole("button", { name: "경험 추가", exact: true }).click();
    await modal
      .getByRole("button", { name: "추가한 경험으로 다시 분석하기" })
      .click();
    await modal.locator(".hypotheses").waitFor();
    await page.screenshot({ path: "tests/screenshots/mobile-workspace.png" });
    await page.keyboard.press("Escape");
    await page
      .locator('a[href="#faq"]')
      .first()
      .evaluate((el) => el.click());
    await page
      .getByRole("button", {
        name: "이력서나 포트폴리오를 꼭 준비해야 하나요?",
      })
      .click();
    assert.equal(
      await page
        .getByRole("button", {
          name: "이력서나 포트폴리오를 꼭 준비해야 하나요?",
        })
        .getAttribute("aria-expanded"),
      "true",
    );
    assert.deepEqual(errors, []);
    assert.ok(
      calls.some(
        (c) => c.url.endsWith("analyze-experience") && c.status === 200,
      ),
    );
    assert.ok(
      calls.some((c) => c.url.endsWith("match-report") && c.status === 200),
    );
    assert.ok(
      calls.some((c) => c.url.endsWith("tune-hypothesis") && c.status === 200),
    );
    console.log(
      JSON.stringify(
        {
          passed: true,
          checks: [
            "letter interaction",
            "form validation",
            "context collection",
            "analysis API",
            "track selection",
            "fit report API",
            "save and pass feedback API",
            "restore passed job",
            "reload persistence",
            "API failure and retry",
            "mobile progressive analysis",
            "FAQ",
            "320–1440px layout",
            "dialog dismissal",
          ],
          apiCalls: calls.length,
          pageErrors: errors,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
