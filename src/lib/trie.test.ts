import { test, expect } from "vitest";
import { Trie } from "$lib/trie";

test("Trie string insertion + contains", () => {
  const trie: Trie = new Trie();

  const s1 = "has";

  expect(trie.contains(s1)).toBeFalsy();
  trie.insert(s1);
  expect(trie.contains(s1)).toBeTruthy();
  expect(trie.containsExclusive(s1)).toBeTruthy();
  expect(trie.contains(s1.slice(0, s1.length - 1))).toBeFalsy();

  let s2 = "hash";
  expect(trie.contains(s2)).toBeFalsy();
  trie.insert(s2);
  expect(trie.contains(s1)).toBeTruthy();
  expect(trie.containsExclusive(s1)).toBeFalsy();
  expect(trie.contains(s2)).toBeTruthy();

  let s3 = "hash brown";
  expect(trie.contains(s3)).toBeFalsy();
  trie.insert(s3);
  expect(trie.contains(s1)).toBeTruthy();
  expect(trie.contains(s2)).toBeTruthy();
  expect(trie.containsExclusive(s1)).toBeFalsy();
  expect(trie.containsExclusive(s2)).toBeFalsy();
  expect(trie.contains(s3)).toBeTruthy();
});
