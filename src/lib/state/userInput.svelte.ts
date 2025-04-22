import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string;
export type UserData =
  | {
      text: string;
      doc: undefined;
      filename: undefined;
    }
  | {
      text: undefined;
      doc: DocFile;
      filename: string;
    };

export const isDoc = (d: UserData) => d.text === undefined;

export const userInput: UserData = $state({
  text: "",
  doc: undefined,
  filename: undefined,
});
