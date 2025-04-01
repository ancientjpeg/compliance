import { DiffChunkOp, createDiffChunk } from "./diffTypes";
import type { DiffChunk } from "./diffTypes";
import { myersDiffRaw } from "./myers";

export function wordDiff(A: string, B: string): DiffChunk<string>[] {

  const tokenize = (s: string): Array<string> => {

    const tokens: Array<string> = [];
    let matchStart = 0;
    let regex = new RegExp('\\S+|\\s+', 'g');

    while (regex.test(s)) {
      tokens.push(s.slice(matchStart, regex.lastIndex));
      matchStart = regex.lastIndex;
    }

    if (matchStart != s.length) {
      throw new Error(`Tokenizer stopped at unexpected point, rL=${matchStart} s=${s.length}`);
    }

    return tokens;
  }

  const chunks = myersDiffRaw(tokenize(A), tokenize(B));

  return chunks.map(c => ({ op: c.op, data: (c.data as Array<string>).join('') }));

}
