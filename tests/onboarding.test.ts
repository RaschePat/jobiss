import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeLocally,
  interests,
  mergeJobFeedback,
  sampleJobs,
} from "../src/onboarding";

test("a first-time user can start from any offered interest without a resume", () => {
  for (const interest of interests) {
    const result = analyzeLocally("", [interest.label]);
    assert.equal(result.mode, "demo");
    assert.equal(result.hypotheses[0].trackName, interest.role);
    assert.deepEqual(result.signals, [interest.label]);
  }
});

test("experience alone can produce a relevant direction without inserting seed-user facts", () => {
  const result = analyzeLocally("React로 웹을 개발하고 GitHub에 올렸어요.", []);
  assert.equal(result.hypotheses[0].trackName, "프론트엔드 개발자");
  assert.equal(
    result.hypotheses.some((h) => h.category === "마케팅"),
    false,
  );
  assert.equal(JSON.stringify(result).includes("32편"), false);
});

test("insufficient information does not manufacture a career or a confidence score", () => {
  assert.deepEqual(analyzeLocally("아직 모르겠어요", []).hypotheses, []);
  assert.deepEqual(analyzeLocally("", []).hypotheses, []);
  assert.ok(
    analyzeLocally("", ["디자인"]).hypotheses.every(
      (h) => h.confidenceScore === 0 && h.matchedJobsCount === 0,
    ),
  );
});

test("sample letters reflect selected directions and disclose that they are examples", () => {
  const result = analyzeLocally("", ["디자인", "개발·기술"]);
  const jobs = sampleJobs(result.hypotheses);
  assert.equal(jobs.length, 2);
  assert.ok(
    jobs.every((j) =>
      j.roleSummary?.includes("실제 모집 중인 공고가 아닙니다"),
    ),
  );
  assert.ok(jobs.every((j) => !JSON.stringify(j).includes("6개 프로젝트")));
  assert.equal(jobs[1].title, "프론트엔드 개발자");
});

test("reanalysis preserves saved and passed feedback even when direction changes", () => {
  const oldJobs = sampleJobs(
    analyzeLocally("", ["디자인", "개발·기술"]).hypotheses,
  );
  oldJobs[0].status = "saved";
  oldJobs[1].status = "passed";
  const nextJobs = sampleJobs(analyzeLocally("", ["데이터·분석"]).hypotheses);
  const merged = mergeJobFeedback(oldJobs, nextJobs);
  assert.equal(merged.length, 3);
  assert.equal(merged.find((j) => j.id === oldJobs[0].id)?.status, "saved");
  assert.equal(merged.find((j) => j.id === oldJobs[1].id)?.status, "passed");
  assert.equal(mergeJobFeedback(merged, nextJobs).length, 3);
});

test("letter identity survives AI analysis IDs changing", () => {
  const track = analyzeLocally("", ["디자인"]).hypotheses[0];
  assert.equal(
    sampleJobs([track])[0].id,
    sampleJobs([{ ...track, id: "new-ai-run" }])[0].id,
  );
});
