import { wordDiff } from "$lib/diff/diff";
import stringReplace from "$lib/stringReplace";
import { DocFile } from "$lib/parse/docxIO";
import { userInput } from "./userInput.svelte";

import type { DiffChunk } from "$lib/diff/diffTypes";
import type { Replacer } from "$lib/replacer";
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
  text: Promise<UserText>;
  filename: string;
  diff: DiffChunk<string>[];
};

export async function transformToOutput(
  input: UserData,
  replacer: Replacer,
): Promise<UserDataOutput> {
  const getTextAsString = async (t: UserData): Promise<string> =>
    isDoc(t) ? t.data.getText() : t.data;

  const text = getTextAsString(input);
  const finalText = stringReplace(text, replacer);

  const filename = getOutputFilename(input.filename);
  const diffEntries = wordDiff(text, finalText);
  return {
    text: finalText,
    filename: filename,
    diff: diffEntries,
  };
}
