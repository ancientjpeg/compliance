import { expect, test } from "vitest";
import diff, { greedyDiffSimple, greedyDiff } from "./diff";
import stringReplace from "$lib/stringReplace";
import defaultReplacer from "$lib/defaultReplacer";

test("diff algorithm returns expected values", async () => {
  const s1 = 'scientists consider equity and to be very important'
  const diff1 = diff(s1, await stringReplace(s1, defaultReplacer) as string);
  expect(diff1[0].added?.text).toBe('fairness');
  expect(diff1[0].added?.pos).toBe(20);
  expect(diff1[0].removed?.text).toBe('equity');
  expect(diff1[0].removed?.pos).toBe(20);
  expect(diff1[1]).toBeUndefined();
})


test("greedy diff algo", () => {
  expect(greedyDiff("ac", "dc")).toBe(2);
  // expect(greedyDiffSimple("charter", "scar")).toBe(5);
  // expect(greedyDiffSimple("scar", "charter")).toBe(5);
  // expect(greedyDiffSimple("ac", "dc")).toBe(2);
  // expect(greedyDiffSimple("bcience", "science")).toBe(2);
  // expect(greedyDiffSimple("report", "rapport")).toBe(3);
  // expect(greedyDiffSimple("stuff", "things")).toBe(9);
})
