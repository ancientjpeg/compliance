import { Trie } from "$lib/trie"

type StringMap = Map<string, string>
type StringArray = string[]
export type Terms = StringMap | StringArray

function isArray(terms: Terms): terms is StringArray {
  return Array.isArray(terms)
}

const adjustReplacementCasing = (original: string, replacement: string): string => {

  const firstCapital = /^[A-Z][a-z]*$/.test(original)
  const anyLower = /[a-z]/.test(original)

  if (firstCapital && anyLower) {
    replacement = replacement[0].toUpperCase() + replacement.slice(1)
  } else if (!anyLower) {
    replacement = replacement.toUpperCase()
  }

  return replacement;
}



export const stringReplace = (input: string, terms: Terms): string => {

  const termsTrie = new Trie;
  let maxKeyLength = 0

  let ret = ''

  let termKeys = isArray(terms) ? terms : terms.keys()


  /* TODO: optimize this by only determining max length when terms change */
  for (const key of termKeys) {
    maxKeyLength = Math.max(key.length, maxKeyLength)
    termsTrie.insert(key)
  }


  let begin = 0;
  while (begin < input.length) {
    let next_space = input.indexOf(' ', begin);
    if (next_space == begin) {
      ret += ' '
      ++begin;
      continue;
    } else if (next_space == -1) {
      next_space = input.length
    }
    console.log({ begin, next_space })

    const word = input.slice(begin, next_space);
    const word_lower = word.toLowerCase();
    if (!/^[A-Za-z0-9]+$/.test(word)) {
      throw new Error("Non-alphanumeric characters aside from space not yet supported. Offending word: " + word)
    }

    console.log({ word, word_lower })

    if (termsTrie.contains(word_lower)) {

      let replacement: string = isArray(terms) ? "[REDACTED]" : adjustReplacementCasing(word, terms.get(word_lower)!);
      console.log({ ret, replacement })
      ret += replacement

    } else {

      ret += word

    }


    begin = next_space
  }


  console.log('')
  return ret
}

