export type ArrayLike<T> = {
	length: number;
	at(index: number): T | undefined;
	slice(start?: number, end?: number): ArrayLike<T>;
};

export enum DiffChunkOp {
	Equal,
	Insert,
	Delete
}

export type DiffChunk<T> = {
	op: DiffChunkOp;
	data: ArrayLike<T>;
};

export const createDiffChunk = <T>(op: DiffChunkOp, data: ArrayLike<T>): DiffChunk<T> => ({
	op,
	data
});
