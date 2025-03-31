export enum DiffChunkOp {
  Equal,
  Insert,
  Delete
}

export type DiffChunk = {
  op: DiffChunkOp;
  data: string;
};

export type HSDynamicTable = number[][];
export type HSResult = {
  lcsLength: number;
  table: HSDynamicTable;
};

