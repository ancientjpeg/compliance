import { DiffChunkOp, createDiffChunk } from "./diffTypes";
import type { DiffChunk, ArrayLike } from "./diffTypes";

type Snake = {
  begin: number;
  end: number;
  k: number;
  D: number;
};
const createSnake = (
  begin: number,
  end: number,
  k: number,
  D: number,
): Snake => ({
  begin,
  end,
  k,
  D,
});

/**
 * We are hoping and praying that the JS engine is smart enough to turn these string slices into references.
 * If that doesn't happen, it honestly might be worth just writing this in Rust/C++ because memory efficiency
 * is kind of a lost cause in JS.
 */
function myersGetMiddleSnake<T>(
  A: ArrayLike<T>,
  B: ArrayLike<T>,
  Vf: (number | undefined)[],
  Vb: (number | undefined)[],
): Snake {
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
    throw new Error("D-path tracker arrays not allocated properly");
  }

  Vf[D_MAX + 1] = 0;
  Vb[D_MAX - 1] = N;

  for (let D = 0; D <= D_MAX; ++D) {
    for (let k = -D; k <= D; k += 2) {
      const k_ind = k + D_MAX;
      const Vf_below = Vf[k_ind - 1]!;
      const Vf_above = Vf[k_ind + 1]!;

      let x;
      if (k == -D || (k != D && Vf_below < Vf_above)) {
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

      if (!DELTA_EVEN && Math.abs(k - DELTA) <= D - 1) {
        const idx_r = k_ind - DELTA;
        const x_r = Vb[idx_r]!;
        if (x_r <= x) {
          return createSnake(x_r, x, k, 2 * D - 1);
        }
      }
    }

    for (let k = -D + DELTA; k <= D + DELTA; k += 2) {
      const k_ind = k + D_MAX - DELTA;
      const Vb_below = Vb[k_ind - 1]!;
      const Vb_above = Vb[k_ind + 1]!;

      let u;
      if (k == D + DELTA || (k != -D + DELTA && Vb_below < Vb_above)) {
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

  throw new Error("greedy diff algorithm has a logic error");
}

function myersDiffInternal<T>(
  A: ArrayLike<T>,
  B: ArrayLike<T>,
  Vf: (number | undefined)[],
  Vb: (number | undefined)[],
): DiffChunk<T>[] {
  let chunks: DiffChunk<T>[] = [];

  if (A.length == 0 && B.length == 0) {
    return chunks;
  } else if (B.length == 0) {
    return [createDiffChunk(DiffChunkOp.Delete, A)];
  } else if (A.length == 0) {
    return [createDiffChunk(DiffChunkOp.Insert, B)];
  }

  const snake = myersGetMiddleSnake(A, B, Vf, Vb);
  if (snake.D <= 1) {
    if (A.length == B.length) {
      return [createDiffChunk(DiffChunkOp.Equal, A)];
    }

    const Aless = A.length < B.length;
    let op = Aless ? DiffChunkOp.Insert : DiffChunkOp.Delete;

    const target_idx = Aless ? snake.begin - snake.k - 1 : snake.begin - 1;
    const target_str = Aless ? B : A;

    const before = createDiffChunk(
      DiffChunkOp.Equal,
      target_str.slice(0, target_idx),
    );
    const target = createDiffChunk(
      op,
      target_str.slice(target_idx, target_idx + 1)!,
    );
    const after = createDiffChunk(
      DiffChunkOp.Equal,
      target_str.slice(target_idx + 1),
    );

    return [before, target, after].filter((el) => el.data.length > 0);
  }

  const begin_y = snake.begin - snake.k;
  const end_y = snake.end - snake.k;

  const A0 = A.slice(0, snake.begin);
  const B0 = B.slice(0, begin_y);
  const A1 = A.slice(snake.end);
  const B1 = B.slice(end_y);

  chunks.push(...myersDiffInternal(A0, B0, Vf, Vb));
  if (snake.begin != snake.end) {
    chunks.push(
      createDiffChunk(DiffChunkOp.Equal, A.slice(snake.begin, snake.end)),
    );
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
export function myersDiffRaw<T>(
  A: ArrayLike<T>,
  B: ArrayLike<T>,
): DiffChunk<T>[] {
  const N = A.length;
  const M = B.length;
  const D_MAX = Math.ceil((N + M) / 2);
  const ARR_LENGTH = D_MAX * 2 + 1;

  let Vf: undefined[] = Array.from({ length: ARR_LENGTH });
  let Vb = [...Vf];

  return myersDiffInternal(A, B, Vf, Vb);
}
