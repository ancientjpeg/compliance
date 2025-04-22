import { wordDiff } from "$lib/diff/diff";
import stringReplace from "$lib/stringReplace";
import { DocFile } from "$lib/parse/docxIO";
import { userInput } from "./userInput.svelte";

import type { DiffChunk } from "$lib/diff/diffTypes";
import type { Replacer } from "$lib/replacer";
import type { UserData, UserText } from "./userInput.svelte";

export const isDoc = (d: UserData) => d.data instanceof DocFile;

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
): Promise<UserDataOutput | null> {
  const getTextAsString = async (t: UserText): Promise<string> =>
    t instanceof DocFile ? await t.getText() : t;

  const finalTextPromise = stringReplace(input.text, replacer);

  const textAsString = await getTextAsString(input.text);

  if (textAsString.length == 0) {
    return null;
  }

  const finalTextAsString = await getTextAsString(await finalTextPromise);

  const filename = getOutputFilename(input.filename);

  const diffEntries = wordDiff(textAsString, finalTextAsString);
  return { text: finalTextPromise, filename, diff: diffEntries };
}
