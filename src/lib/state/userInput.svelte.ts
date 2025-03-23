import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string
export type UserData = {
  text: Promise<UserText>,
  filename: string | undefined
};

export const userInput
  : UserData
  = $state({
    text: Promise.resolve(''),
    filename: undefined
  })

