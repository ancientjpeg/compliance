import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string
export const defaultInput = 'Input your text here.';
export const defaultOutput = 'Text will output here.';
export const userInput
  : {
    text: Promise<UserText>,
    filename: string | undefined
  }
  = $state({
    text: Promise.resolve(defaultInput),
    filename: undefined
  })

export const userOutput: Promise<UserText> = $state(Promise.resolve(defaultOutput));
