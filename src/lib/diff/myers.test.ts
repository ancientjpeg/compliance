import { test, expect } from 'vitest'
import { myersDiffRaw } from "./myers";
import { DiffChunkOp } from './diff.d';

test("Myer's diff correctness checks.", async () => {
  const sames = myersDiffRaw("The cat in the hat.", "The dog in the log.").filter(c => c.op == DiffChunkOp.Equal);
  expect(sames.length).toBe(3);
  expect(sames[0].data).toBe('The ');
  expect(sames.at(-1)?.data).toBe('.');
})

