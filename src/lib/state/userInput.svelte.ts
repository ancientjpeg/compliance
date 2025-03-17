import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string
export type UserData = {
  text: Promise<UserText>,
  filename: string | undefined
};
export const defaultInput = 'Input your text here.';
export const defaultOutput = 'Text will output here.';
export function getOutputFilename(filename: string | undefined) {
  if (!filename) {
    return 'compliant.txt';
  } else {
    const splits = filename.split('.');
    const ext = splits.length > 1 ? `.${splits.pop()}` : '';
    const base = splits.join('.');
    return `${base}.compliant${ext}`;
  }
}

export const userInput
  : UserData
  = $state({
    text: Promise.resolve(defaultInput),
    filename: undefined
  })

export const userOutput: UserData = $state(
  {
    text: Promise.resolve(defaultOutput),
    filename: getOutputFilename(undefined)
  }
);

