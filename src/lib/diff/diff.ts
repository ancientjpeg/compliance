import { huntSzymanskiWithTable } from "./huntSzymanski";

export enum DiffChunkOp {
  Equal,
  Insert,
  Delete
}

export type DiffChunk = {
  op: DiffChunkOp;
  data: string;
};

const createDiffChunk = (op: DiffChunkOp, data: string): DiffChunk => ({ op, data });

type Snake = {
  begin: number;
  end: number;
  k: number;
  D: number;
}
const createSnake = (begin: number, end: number, k: number, D: number): Snake => ({ begin, end, k, D })

/** 
 * We are hoping and praying that the JS engine is smart enough to turn these string slices into references.
 * If that doesn't happen, it honestly might be worth just writing this in Rust/C++ because memory efficiency
 * is kind of a lost cause in JS.
 */
export function myersGetMiddleSnake(A: string, B: string, Vf: (number | undefined)[], Vb: (number | undefined)[]): Snake {

  const N = A.length;
  const M = B.length;
  const D_MAX = Math.ceil((N + M) / 2);
  const DELTA = N - M; /* k == DELTA for point (N, M) */
  const DELTA_EVEN = (DELTA & 1) == 0;
  const ARR_LENGTH = D_MAX * 2 + 1;

  /** 
   * The `V` arrays store the x-coordinate of the longest reaching paths for
   * diagonal `k` in `V[k + ARRSIZE]`. There is one forward and one backward
   * array.
   */
  if (Vf.length < ARR_LENGTH || Vb.length < ARR_LENGTH) {
    throw new Error("D-path tracker arrays not allocated properly")
  }

  Vf[D_MAX + 1] = 0;
  Vb[D_MAX - 1] = N;

  for (let D = 0; D <= D_MAX; ++D) {
    for (let k = -D; k <= D; k += 2) {

      const k_ind = k + D_MAX
      const Vf_below = Vf[k_ind - 1]!;
      const Vf_above = Vf[k_ind + 1]!;

      let x;
      if (k == -D || k != D && Vf_below < Vf_above) {
        x = Vf_above;
      } else {
        x = Vf_below + 1;
      }

      let y = x - k;

      while (A.at(x) == B.at(y) && x < N && y < M) {
        ++x;
        ++y;
      }

      Vf[k_ind] = x;


      if (!DELTA_EVEN && Math.abs(k - DELTA) <= (D - 1)) {
        const idx_r = k_ind - DELTA;
        const x_r = Vb[idx_r]!;
        if (x_r <= x) {
          return createSnake(x_r, x, k, 2 * D - 1);
        }
      }
    }

    for (let k = -D + DELTA; k <= D + DELTA; k += 2) {

      const k_ind = k + D_MAX - DELTA
      const Vb_below = Vb[k_ind - 1]!;
      const Vb_above = Vb[k_ind + 1]!;

      let u;
      if (k == (D + DELTA) || k != (-D + DELTA) && Vb_below < Vb_above) {
        u = Vb_below;
      } else {
        u = Vb_above - 1;
      }


      let v = u - k;


      while (A.at(u - 1) == B.at(v - 1) && u > 0 && v > 0) {
        --u;
        --v;
      }

      Vb[k_ind] = u;

      if (DELTA_EVEN && Math.abs(k) <= D) {
        const idx_f = k_ind + DELTA;
        const x_f = Vf[idx_f]!;
        if (x_f >= u) {
          return createSnake(u, x_f, k, 2 * D);
        }
      }
    }
  }

  throw new Error("greedy diff algorithm has a logic error")

}

function myersDiffInternal(A: string, B: string, Vf: (number | undefined)[], Vb: (number | undefined)[]): DiffChunk[] {

  let chunks: DiffChunk[] = []

  if (A.length == 0 && B.length == 0) {
    return chunks;
  } else if (B.length == 0) {
    return [createDiffChunk(DiffChunkOp.Delete, A)]
  } else if (A.length == 0) {
    return [createDiffChunk(DiffChunkOp.Insert, B)]
  }

  const snake = myersGetMiddleSnake(A, B, Vf, Vb);
  if (snake.D <= 1) {
    if (A.length == B.length) {
      return [createDiffChunk(DiffChunkOp.Equal, A)];
    }

    const Aless = A.length < B.length;
    let op = Aless ? DiffChunkOp.Insert : DiffChunkOp.Delete

    const target_idx = Aless ? (snake.begin - snake.k) - 1 : snake.begin - 1;
    const target_str = Aless ? B : A;

    const before = createDiffChunk(DiffChunkOp.Equal, target_str.slice(0, target_idx));
    const target = createDiffChunk(op, target_str.at(target_idx)!);
    const after = createDiffChunk(DiffChunkOp.Equal, target_str.slice(target_idx + 1));

    return [before, target, after].filter(el => el.data.length > 0);
  }

  const begin_y = snake.begin - snake.k;
  const end_y = snake.end - snake.k;

  const A0 = A.slice(0, snake.begin);
  const B0 = B.slice(0, begin_y);
  const A1 = A.slice(snake.end);
  const B1 = B.slice(end_y);

  chunks.push(...myersDiffInternal(A0, B0, Vf, Vb));
  if (snake.begin != snake.end) {
    chunks.push(createDiffChunk(DiffChunkOp.Equal, A.slice(snake.begin, snake.end)));
  }
  chunks.push(...myersDiffInternal(A1, B1, Vf, Vb));

  return chunks;
}

/**
 * @brief An implementation of 
 * [Myers' diff algorithm](http://www.xmailserver.org/diff2.pdf).
 * 
 * @param A - Original string
 * @param B - New string
 */
export function myersDiff(A: string, B: string): DiffChunk[] {

  const N = A.length;
  const M = B.length;
  const D_MAX = Math.ceil((N + M) / 2);
  const ARR_LENGTH = D_MAX * 2 + 1;

  let Vf: undefined[] = Array.from({ length: ARR_LENGTH });
  let Vb = [...Vf];

  return myersDiffInternal(A, B, Vf, Vb);

}

export function greedyDiffSimple(A: string, B: string): number {
  const M = A.length;
  const N = B.length;
  const MAX = M + N;

  let V = Array.from({ length: MAX * 2 + 1 }, (_, i) => i - MAX);

  V[MAX + 1] = 0;

  for (let D = 0; D <= MAX; ++D) {
    for (let k = -D; k <= D; k += 2) {

      const k_ind = k + MAX;
      let x, y;
      if ((k == 0 || k != D) && (V[k_ind - 1] ?? -1) < V[k_ind + 1]) {
        x = V[k_ind + 1];
      } else {
        x = V[k_ind - 1] + 1;
      }
      y = x - k; // by definition

      while (x < N && y < M && B.at(x) == A.at(y)) {
        ++x;
        ++y;
      }
      V[k_ind] = x;

      if (x >= N && y >= M) {
        if (k != N - M) {
          throw new Error("Algo ended at unexpected point");
        }
        return D
      }
    }
  }

  throw new Error("greedy diff algorithm has a logic error")
}



type DiffEntryMeta = {
  text: string; /* text of the diff */
  pos: number; /* idx in the original string where the diff occurs */
}
export type DiffEntry = {
  added: DiffEntryMeta | undefined
  removed: DiffEntryMeta | undefined
  begin: number; /* idx in the GCS where the diff occurs */
}

function diff(A: string, B: string): DiffEntry[] {
  let lcs = huntSzymanskiWithTable(A, B);
  const table = lcs.table;
  let m = A.length, n = B.length;
  let i = m, j = n;

  let aDiff: string[] = [], bDiff: string[] = [];
  let entries: DiffEntry[] = [];

  const dumpDiffs = (pos: number, i: number, j: number) => {
    let entry: DiffEntry = {
      added: undefined,
      removed: undefined,
      begin: pos,
    }

    if (aDiff.length != 0) {
      entry.removed = {
        text: aDiff.reverse().join(''),
        pos: i
      };

      aDiff = []
    }

    if (bDiff.length != 0) {
      entry.added = {
        text: bDiff.reverse().join(''),
        pos: j
      };
      bDiff = []
    }

    if (entry.added || entry.removed) {
      entries.push(entry);
    }

  }

  while (i > 0 || j > 0) {
    const currResult = table[i][j] ?? -1;
    const leftResult = table[i][j - 1] ?? -1;
    const upResult = table.at(i - 1)?.at(j) ?? -1;


    /* This means that this P(i,j) resulted in a GCS increase */
    /* Thus, char is the same, and we should trace back 1 char in both strings */
    if (leftResult < currResult && upResult < currResult) {
      dumpDiffs(currResult, i, j);

      --i;
      --j;
    } else {

      /* this means A contributed a char not in GCS */
      if (upResult == currResult) {
        aDiff.push(A[--i]);
      }

      /* this means B contributed a char not in GCS */
      if (leftResult == currResult) {
        bDiff.push(B[--j]);
      }
    }


  }

  dumpDiffs(0, 0, 0);

  return entries.reverse();
}

export default diff;
