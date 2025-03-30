import { huntSzymanskiWithTable } from "./huntSzymanski";

/**
 * @brief An implementation of 
 * [Myers' diff algorithm](http://www.xmailserver.org/diff2.pdf).
 * 
 * @param A - Original string
 * @param B - New string
 */
export function myersDiff(A: string, B: string): number {

  const N = A.length;
  const M = B.length;
  const D_MAX = Math.ceil((N + M) / 2);
  const DELTA = N - M; /* k == DELTA for point (N, M) */
  const DELTA_EVEN = (DELTA & 1) == 0;



  /** 
   * The `V` arrays store the x-coordinate of the longest reaching paths for
   * diagonal `k` in `V[k + ARRSIZE]`. There is one forward and one backward
   * array.
   */
  let Vf = Array.from({ length: D_MAX * 2 + 1 }, (_, i) => Math.min(0, i - D_MAX));
  let Vb = Array.from({ length: D_MAX * 2 + 1 }, (_, i) => Math.max(0, i - D_MAX) + N);



  for (let D = 0; D <= D_MAX; ++D) {
    for (let k = -D; k <= D; k += 2) {

      const k_ind = k + D_MAX
      const fr_below = Vf[k_ind - 1] ?? -1;
      const fr_above = Vf[k_ind + 1] ?? -1;

      let x;
      if (fr_below < fr_above) {
        x = fr_above;
      } else {
        x = fr_below + 1;
      }


      let y = x - k;


      while (A.at(x) == B.at(y) && x < N && y < M) {
        ++x;
        ++y;
      }

      Vf[k_ind] = x;


      if (!DELTA_EVEN && Math.abs(k - DELTA) <= (D - 1)) {
        const idx_r = k_ind - DELTA;
        const x_r = Vb[idx_r];
        if (x_r <= x) {
          return 2 * D - 1;
        }
      }
    }

    for (let k = -D + DELTA; k <= D + DELTA; k += 2) {

      const k_ind = k + D_MAX - DELTA
      const fr_below = Vb[k_ind - 1] ?? Number.MAX_SAFE_INTEGER;
      const fr_above = Vb[k_ind + 1] ?? Number.MAX_SAFE_INTEGER;

      let u;
      if (fr_below < fr_above) {
        u = fr_below;
      } else {
        u = fr_above - 1;
      }


      let v = u - k;


      while (A.at(u - 1) == B.at(v - 1) && u > 0 && v > 0) {
        --u;
        --v;
      }

      Vb[k_ind] = u;

      if (DELTA_EVEN && Math.abs(k) <= D) {
        const idx_f = k_ind + DELTA;
        const x_f = Vf[idx_f];
        if (x_f >= u) {
          return 2 * D;
        }
      }
    }
  }

  throw new Error("greedy diff algorithm has a logic error")
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
