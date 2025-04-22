import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string;
export type UserData = {
  text: string;
  doc: DocFile | undefined;
  filename: string | undefined;
};

export const userInput: UserData = $state({
  text: "",
  doc: undefined,
  filename: undefined,
});
