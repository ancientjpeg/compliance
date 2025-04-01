export enum DiffChunkOp {
  Equal,
  Insert,
  Delete
}

export type DiffChunk = {
  op: DiffChunkOp;
  data: string;
};

