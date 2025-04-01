export enum DiffChunkOp {
  Equal,
  Insert,
  Delete
}

export type DiffChunk = {
  op: DiffChunkOp;
  data: string;
};

export const createDiffChunk = (op: DiffChunkOp, data: string): DiffChunk => ({ op, data });
