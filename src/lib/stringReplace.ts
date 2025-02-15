import { Trie } from "$lib/trie"

type StringMap = Map<string, string>
type StringArray = string[]
export type Terms = StringMap | StringArray

function isArray(terms: Terms): terms is StringArray {
  return Array.isArray(terms)
}



export const stringReplace = (input: string, terms: Terms): string => {

  const termsTrie = new Trie;
  let maxKeyLength = 0

  let ret = ''


  /* TODO: optimize this by only determining max length when terms change */
  for (const key in terms) {
    maxKeyLength = Math.max(key.length, maxKeyLength)
    termsTrie.insert(key)
  }


  let begin = 0;
  while (begin < input.length) {
    const next_space = input.indexOf(' ', begin);
    if (next_space == begin) {
      ret += ' '
      ++begin;
      continue;
    } else if (next_space == -1) {
      next_space == input.length
    }

    const word = input.slice(begin, next_space);
    const word_lower = word.toLowerCase();
    if (!/^[A-Za-z0-9]+$/.test(word)) {
      throw new Error("Non-alphanumeric characters aside from space not yet supported. Offending word: " + word)
    }


    if (termsTrie.contains(word_lower)) {

      let replacement: string;

      if (isArray(terms)) {

      } else {
      }


    } else {
      ret = ret + word
    }


    begin = next_space
  }


  return input
}

