import { create } from "domain";
import { DiffChunkOp, createDiffChunk } from "./diffTypes";
import type { DiffChunk } from "./diffTypes";
import { myersDiffRaw } from "./myers";

export function diffCleanup(chunks: DiffChunk[]): DiffChunk[] {
  const cleanChunks: DiffChunk[] = []

  const getDel = () => createDiffChunk(DiffChunkOp.Delete, '');
  const getIns = () => createDiffChunk(DiffChunkOp.Insert, '');

  const runningDelete: DiffChunk | null = null;
  const runningInsert: DiffChunk | null = null;

  for (const chunk of chunks) {
    if (!runningDelete && !runningInsert && chunk.op == DiffChunkOp.Equal) {
      cleanChunks.push(chunk);
      continue;
    }
  }
  return cleanChunks;
}


function cleanDiff(A: string, B: string) {

  return diffCleanup(myersDiffRaw(A, B));

}

const diff = cleanDiff;

export default diff;
