import { expect, test } from "vitest";
import diff, { greedyDiffSimple, myersDiff, myersGetMiddleSnake } from "./diff";
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
  const getSnake = (A: string, B: string) => {
    let Vf: undefined[] = Array.from({ length: 11 });
    let Vb = [...Vf];
    return myersGetMiddleSnake(A, B, Vf, Vb)
  }

  expect(getSnake("abcd", "zbczz")).toStrictEqual({ begin: 3, end: 3, k: -1 });
  expect(getSnake("abc", "zbcz")).toStrictEqual({ begin: 1, end: 3, k: 0 });

  const chunks = myersDiff("abcd", "zbczz")
  expect(chunks.length).toBe(5)
})
