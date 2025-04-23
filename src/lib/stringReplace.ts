import type { Replacer } from "./state/replacer";
import { DocFile } from "./parse/docxIO";

const adjustReplacementCasing = (
  original: string,
  replacement: string,
): string => {
  const firstCapital = /^[A-Z].*$/.test(original);
  const anyLower = /[a-z]/.test(original);

  if (firstCapital && anyLower) {
    replacement = replacement[0].toUpperCase() + replacement.slice(1);
  } else if (!anyLower) {
    replacement = replacement.toUpperCase();
  }

  return replacement;
};

const stringReplaceInternal = (input: string, terms: Replacer): string => {
  /* TODO: only calculate this once every time a new dict is generated */
  let maxLength = 0;
  let minLength = Number.MAX_VALUE;
  for (const key of terms.keys()) {
    maxLength = Math.max(maxLength, key.length);
    minLength = Math.min(minLength, key.length);
  }

  const index_map: Map<number, number> = new Map();

  for (let i = 0; i < input.length; i++) {
    const innerEnd = Math.min(i + maxLength, input.length);
    for (let j = i + minLength; j <= innerEnd; ++j) {
      const word = input.slice(i, j);
      if (terms.has(word.toLowerCase())) {
        if (!index_map.has(i) || index_map.get(i)! < j) {
          index_map.set(i, j);
        }
      }
    }
  }

  let ret = "";

  for (let i = 0; i < input.length; ) {
    if (index_map.has(i)) {
      const word = input.slice(i, index_map.get(i)!);
      const word_lower = word.toLowerCase();
      ret += adjustReplacementCasing(word, terms.get(word_lower)!);
      i = index_map.get(i)!;
    } else {
      ret += input[i++];
    }
  }

  return ret;
};

function stringReplace(
  input: string | DocFile,
  terms: Replacer,
): string | DocFile {
  if (input instanceof DocFile) {
    return input.forEachTextBlock((s) => stringReplaceInternal(s, terms));
  }
  return stringReplaceInternal(input, terms);
}

export default stringReplace;
