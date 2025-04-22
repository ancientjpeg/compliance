import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string;
export type UserData =
  | {
      data: string;
      filename: undefined;
    }
  | {
      data: DocFile;
      filename: string;
    };

export const userInput: UserData = $state({
  text: "",
  filename: undefined,
});
