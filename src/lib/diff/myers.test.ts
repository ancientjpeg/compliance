import { test, expect } from 'vitest'
import { myersDiffClean } from "./myers";
import { DiffChunkOp } from './diff.d';

test("Myer's diff correctness checks.", async () => {

  let checkChunks = (A: string, B: string, len: number) => {
    let chunks = myersDiffClean(A, B);
    expect(chunks.length).toBe(len)
  }

  checkChunks("stuff", "stutff", 3);
  checkChunks("stufft", "stuff", 2);
  checkChunks("abcd", "zbczz", 5);
  const sames = myersDiffClean("The cat in the hat.", "The dig in the rig.").filter(c => c.op == DiffChunkOp.Equal);
  expect(sames.length).toBe(3);
  expect(sames[0].data).toBe('The ');
  expect(sames[2].data).toBe('.');
})

