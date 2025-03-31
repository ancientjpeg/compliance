import { expect, test } from "vitest";
import diff, { DiffChunkOp, greedyDiffSimple, myersDiff, myersGetMiddleSnake } from "./diff";
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
    let Vf: undefined[] = Array.from({ length: (Math.ceil((A.length + B.length) / 2) * 2 + 1) });
    let Vb = [...Vf];
    return myersGetMiddleSnake(A, B, Vf, Vb)
  }

  expect(getSnake("st", "s")).toStrictEqual({ begin: 2, end: 2, k: 1, D: 1 });
  expect(getSnake("ts", "s")).toStrictEqual({ begin: 1, end: 2, k: 1, D: 1 });
  expect(getSnake("stufft", "stuff")).toStrictEqual({ begin: 6, end: 6, k: 1, D: 1 });
  expect(getSnake("abcd", "zbczz")).toStrictEqual({ begin: 3, end: 3, k: -1, D: 5 });
  expect(getSnake("abc", "zbcz")).toStrictEqual({ begin: 1, end: 3, k: 0, D: 3 });


  let checkChunks = (A: string, B: string, len: number) => {
    let chunks = myersDiff(A, B);
    console.log(chunks);
    expect(chunks.length).toBe(len)
  }

  checkChunks("stuff", "stutff", 3);
  checkChunks("stufft", "stuff", 2);
  checkChunks("abcd", "zbczz", 6)
  const sames = myersDiff("The cat in the hat.", "The dig in the rig.").filter(c => c.op == DiffChunkOp.Equal);
  console.log(sames);
  expect(sames.length).toBe(3)

  // TODO gen random
  const big0 = 's'.repeat(1000000);

  const big1 = 'zzz' + big0.slice() + 'zz';

  const bigChunks = myersDiff(big0, big1);
  console.log(bigChunks[0]);
  // expect(bigChunks.at(-1)?.data).toBe('zz');



})
