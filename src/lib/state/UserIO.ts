import { wordDiff } from "$lib/diff/diff";
import stringReplace from "$lib/stringReplace";
import { DocFile } from "$lib/parse/docxIO";
import { userInput } from "./userInput.svelte";

import { DiffChunkOp, type DiffChunk } from "$lib/diff/diffTypes";
import type { Replacer } from "$lib/state/replacer";
import type { UserData, UserText } from "./userInput.svelte";

export const isDoc = (d: UserData) => d.kind === "doc";

function getOutputFilename(filename: string | undefined) {
  if (!filename) {
    return "compliant.txt";
  } else {
    const splits = filename.split(".");
    const ext = splits.length > 1 ? `.${splits.pop()}` : "";
    const base = splits.join(".");
    return `${base}.compliant${ext}`;
  }
}

export async function updateUserInput(input: UserData) {
  userInput.kind = input.kind;
  userInput.data = input.data;
  userInput.filename = input.filename;
}

/** TODO refactor */
export type UserDataOutput = {
  data: UserText;
  filename: string;
  diff: DiffChunk<string>[];
};

export function transformToOutput(
  input: string | DocFile,
  filename: string | undefined,
  replacer: Replacer,
): UserDataOutput | null {
  const getTextAsString = (t: string | DocFile): string =>
    t instanceof DocFile ? t.getText() : t;

  const text = getTextAsString(input);

  if (text.length === 0) {
    return null;
  }

  const finalText = stringReplace(input, replacer);
  let finalTextString = getTextAsString(finalText);

  filename = getOutputFilename(filename);

  const diffEntries = wordDiff(text, finalTextString);

  const diffEntriesProcessed = diffEntries.map((entry) => {
    const maxStrlen = 100;
    if (entry.op != DiffChunkOp.Equal || entry.data.length <= maxStrlen) {
      return entry;
    }
    const chunkLen = Math.floor((maxStrlen - 3) / 2);
    const newData =
      entry.data.slice(0, chunkLen) +
      "..." +
      entry.data.slice(-chunkLen, entry.data.length);
    const newEntry = {
      op: entry.op,
      data: newData,
    };
    return newEntry;
  });

  return {
    data: finalText,
    filename: filename,
    diff: diffEntriesProcessed,
  };
}
