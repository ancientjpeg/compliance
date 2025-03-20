export type DiffResult = {
  stuff: [number, number][]
};

type HSDynamicTable = number[][];
type HSResult = {
  lcsLength: number;
  table: HSDynamicTable;
};

function huntSzymanski(A: string, B: string): HSResult {
  let table: HSDynamicTable = Array.from({ length: A.length + 1 }, () => Array(B.length + 1).fill(-1));;

  for (let i = 0; i <= A.length; ++i) {
    for (let j = 0; j <= B.length; ++j) {

      const charAi = A.charAt(i - 1);
      const charBj = B.charAt(j - 1);

      let val = -1;
      if (i == 0 || j == 0) {
        val = 0;
      } else if (charAi == charBj) {
        val = 1 + table.at(i - 1)?.at(j - 1)!;
      } else if (charAi != charBj) {
        val = Math.max(table.at(i - 1)?.at(j)!, table.at(i)?.at(j - 1)!);
      }

      table[i][j] = val;
    }
  }

  const ret = table.at(A.length)?.at(B.length);
  if (ret === undefined) {
    throw new Error('Hunt-Szymanski algorithm implementation flawed');
  }
  return { lcsLength: ret, table };
}

export default huntSzymanski
