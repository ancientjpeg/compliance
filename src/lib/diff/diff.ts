import myersDiff from "./myers";

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




const diff = myersDiff;
export default diff;
