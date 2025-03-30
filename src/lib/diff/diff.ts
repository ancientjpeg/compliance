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
  const MAX = N + M;
  const ARRSIZE = Math.ceil((N + M) / 2);
  const DELTA = N - M; /* k == DELTA for point (N, M) */



  /** 
   * The `V` arrays store the x-coordinate of the longest reaching paths for
   * diagonal `k` in `V[k + ARRSIZE]`. There is one forward and one backward
   * array.
   */
  const genArray = () => Array.from({ length: ARRSIZE * 2 + 1 }, (_, i) => Math.max(0, i - ARRSIZE));
  let Vf = genArray();
  let Vb = genArray();
  console.log(Vf);
  console.assert(Vf == Vb);


  for (let D = 0; D <= ARRSIZE; ++D) {
    for (let k = -D; k <= D; k += 2) {
      console.log("FORWARD ITERATION:")
      console.log({ D, k })
    }
    for (let k = -D; k <= D; k += 2) {
      console.log("REVERSE ITERATION:")
      k += DELTA
      console.log({ D, k })
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
