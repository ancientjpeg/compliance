import { userInput, type UserData, type UserText } from "./userInput.svelte";
import { DocFile } from "$lib/parse/docxIO";
import stringReplace from "$lib/stringReplace";
import type { Replacer } from "$lib/replacer";
import diff, { type DiffEntry } from "$lib/diff/diff";




function getOutputFilename(filename: string | undefined) {
  if (!filename) {
    return 'compliant.txt';
  } else {
    const splits = filename.split('.');
    const ext = splits.length > 1 ? `.${splits.pop()}` : '';
    const base = splits.join('.');
    return `${base}.compliant${ext}`;
  }
}

type DiffString = {
  text: string
  isAdded: boolean
}

export async function updateUserInput(text: string | DocFile, filename: string | undefined = undefined) {
  console.log(`UPDATE ${filename}`);
  const isDoc = text instanceof DocFile; 

  if (isDoc) {
    userInput.doc = text;
    userInput.text = await text.getText()
  } else {
    userInput.text = text;
    userInput.doc = undefined;
  }

  userInput.filename = filename;
}

function createDiffStrings(postString: string, diffEntries: DiffEntry[]): DiffString[] {
  let diffStrings: DiffString[] = []
  let nextToAdd: number = 0;

  let addNonDiffText = (text: string) => {
    if (text) {
      diffStrings.push({text, isAdded: false});
    }
  };

  for (const d of diffEntries) {
    if (!d.added) {
      continue;
    }

    addNonDiffText(postString.slice(nextToAdd, d.added.pos));
    diffStrings.push({text: d.added.text, isAdded: true});

    nextToAdd = d.added.pos + d.added.text.length;
  }

  addNonDiffText(postString.slice(nextToAdd));

  return diffStrings;
}


/** TODO refactor */
export type UserDataOutput = {
  text: Promise<UserText>;
  filename: string
  diff: DiffString[]
};

export async function transformToOutput(input: UserData, replacer: Replacer): Promise<UserDataOutput> {
  const getTextAsString = async (t: UserText): Promise<string> => t instanceof DocFile ? await t.getText() : t;
  
  const finalTextPromise = stringReplace(input.text, replacer);

  const textAsString = await getTextAsString(input.text)
  const finalTextAsString = await getTextAsString(await finalTextPromise)

  const filename = getOutputFilename(input.filename);

  const diffEntries = diff(textAsString, finalTextAsString);
  console.log(diffEntries);
  return { text: finalTextPromise, filename, diff: createDiffStrings(finalTextAsString, diffEntries) };
}

