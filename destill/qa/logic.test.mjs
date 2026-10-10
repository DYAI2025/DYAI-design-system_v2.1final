/* Destill QA — unit tests for the pure logic layer. Run: npm test */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const L = require("../js/logic.js");

test("fmtTime formats minutes and seconds", () => {
  assert.equal(L.fmtTime(0), "0:00");
  assert.equal(L.fmtTime(59), "0:59");
  assert.equal(L.fmtTime(754), "12:34");
  assert.equal(L.fmtTime(-3), "0:00");
});

test("fmtTimePadded keeps tabular alignment", () => {
  assert.equal(L.fmtTimePadded(59), "00:59");
  assert.equal(L.fmtTimePadded(252), "04:12");
});

test("computeOutcome sums the demo decisions", () => {
  const o = L.computeOutcome(L.demoSegments());
  assert.equal(o.total, 252);
  assert.equal(o.seconds, 178);   // 252 - 36 (aside) - 38 (outro)
  assert.equal(o.removed, 74);
  assert.equal(o.keep, 4);
  assert.equal(o.change, 1);
  assert.equal(o.drop, 2);
});

test("changing a verdict recomputes the outcome", () => {
  const segs = L.demoSegments();
  segs[3].decision = "keep"; // keep the tangent too
  const o = L.computeOutcome(segs);
  assert.equal(o.seconds, 214);
  assert.equal(o.removed, 38);
});

test("state machine only allows designed transitions", () => {
  assert.equal(L.canGo("welcome", "source"), true);
  assert.equal(L.canGo("welcome", "refine"), false);
  assert.equal(L.canGo("source", "blocked-analyze"), true);
  assert.equal(L.canGo("processing", "understanding"), true);
  assert.equal(L.canGo("refine", "blocked-render"), true);
  assert.equal(L.canGo("blocked-render", "result"), true);
  assert.equal(L.canGo("result", "processing"), false);
});

test("steps map states onto the journey", () => {
  assert.equal(L.stepOf("source"), 0);
  assert.equal(L.stepOf("understanding"), 1);
  assert.equal(L.stepOf("refine"), 2);
  assert.equal(L.stepOf("result"), 3);
});

test("prompt lists removals and reworks, never fabricated precision", () => {
  const p = L.buildPrompt({
    segments: L.demoSegments(),
    sourceName: "destill_synthetic_source.mp4",
    intent: "Keep only the strong claims",
    targetSeconds: 90
  });
  assert.match(p, /- Remove 01:36–02:12 \(Tangent — microphone setup\)\./);
  assert.match(p, /- Rework 02:58–03:34/);
  assert.match(p, /Intent: Keep only the strong claims/);
  assert.doesNotMatch(p, /confidence|score|\d+(\.\d+)?%/i);
});

test("demo data is fresh per call (no shared mutation)", () => {
  const a = L.demoSegments();
  a[0].decision = "drop";
  assert.equal(L.demoSegments()[0].decision, "keep");
});
