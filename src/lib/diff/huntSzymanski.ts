function huntSzymanski(A: string, B: string): number {
  const rowSize = B.length + 1;
  let rows: [number[], number[]] = [Array(rowSize).fill(0), Array(rowSize).fill(0)];


  for (let i = 0; i <= A.length; ++i) {

    const lastRow = rows[0];
    const currRow = rows[1];
    currRow[0] = 0;

    for (let j = 1; j <= B.length; ++j) {

      const charAi = A.charAt(i - 1);
      const charBj = B.charAt(j - 1);

      let val = -1;
      if (i == 0 || j == 0) {
        val = 0;
      } else if (charAi == charBj) {
        val = 1 + lastRow[j - 1];
      } else if (charAi != charBj) {
        val = Math.max(lastRow[j], currRow[j - 1]);
      }

      currRow[j] = val;
    }

    /* branch is probably faster than a refswap */
    if (i != A.length) {
      const tempRow = rows[0];
      rows[0] = rows[1];
      rows[1] = tempRow;
    }
  }


  return rows[1][rowSize - 1]
}

export default huntSzymanski
