import { expect, test } from "vitest";
import diff from "./diff";
import stringReplace from "$lib/stringReplace";
import defaultReplacer from "$lib/defaultReplacer";

test("diff algorithm returns expected values", async () => {

  let checkChunks = (A: string, B: string, len: number) => {
    let chunks = diff(A, B);
    expect(chunks.length).toBe(len)
  }

  checkChunks("stuff", "stutff", 3);
  checkChunks("stufft", "stuff", 2);
  checkChunks("abcd", "zbczz", 5);
})
