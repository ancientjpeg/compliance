import { expect, test } from "vitest";
import { myersDiffRaw } from "./myers";
import diff from "./diff";
import { diffCleanup } from "./diff";
import stringReplace from "$lib/stringReplace";
import defaultReplacer from "$lib/defaultReplacer";
import { DiffChunkOp } from "./diffTypes";


test("diff cleanup performs as expected", () => {
  const s0 = "get three drinks";
  const s1 = "get five drinks";

  const chunks = myersDiffRaw(s0, s1);
  console.log(chunks);

  const cleanChunks = diffCleanup(chunks);

  expect(cleanChunks[0].data).toBe("get ");
  expect(cleanChunks[0].op).toBe(DiffChunkOp.Equal);
  expect(cleanChunks[1].data).toBe("three");
  expect(cleanChunks[1].op).toBe(DiffChunkOp.Delete);
  expect(cleanChunks[2].data).toBe("five");
  expect(cleanChunks[2].op).toBe(DiffChunkOp.Delete);
  expect(cleanChunks[3].data).toBe(" drinks");
  expect(cleanChunks[3].op).toBe(DiffChunkOp.Equal);

});

test("diff algorithm returns expected values", async () => {

  let checkChunks = (A: string, B: string, len: number) => {
    let chunks = diff(A, B);
    expect(chunks.length).toBe(len)
  }

  checkChunks("stuff", "stutff", 3);
  checkChunks("stufft", "stuff", 2);
  checkChunks("abcd", "zbczz", 5);
})
