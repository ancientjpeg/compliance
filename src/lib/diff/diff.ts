import { huntSzymanskiWithTable } from "./huntSzymanski";

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

      console.log(`removed '${JSON.stringify(entry.removed)}' at gcs pos ${pos}`);
      aDiff = []
    }

    if (bDiff.length != 0) {
      entry.added = {
        text: bDiff.reverse().join(''),
        pos: j
      };
      console.log(`added '${JSON.stringify(entry.added)}' at gcs pos ${pos}`);
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
