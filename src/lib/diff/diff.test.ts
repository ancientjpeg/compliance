import { expect, test } from "vitest";
import { myersDiffRaw } from "./myers";
import { wordDiff } from "./diff";
import { DiffChunkOp } from "./diffTypes";


test("diff algorithm returns expected values", async () => {

  let checkChunks = (A: string, B: string, len: number) => {
    let chunks = myersDiffRaw(A, B);
    expect(chunks.length).toBe(len)
  }

  checkChunks("stuff", "stutff", 3);
  checkChunks("stufft", "stuff", 2);
  checkChunks("abcd", "zbczz", 6);
})

test("tokenized diff algorithm returns expected values", async () => {

  const chunks = wordDiff("first line\nsecond line", "fifth line\nsixth tree");
  expect(chunks.length).toBe(8)
  expect(chunks[0].op).toBe(DiffChunkOp.Insert);
  expect(chunks[0].data).toBe('fifth');
  expect(chunks[2].op).toBe(DiffChunkOp.Equal);
  expect(chunks[2].data).toBe(' line\n');
})
