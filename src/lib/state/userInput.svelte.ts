import { DocFile } from "$lib/parse/docxIO";
export type UserText = DocFile | string;
export type UserData =
  | {
      kind: "doc";
      data: DocFile;
      filename: string;
    }
  | {
      kind: "text";
      data: string;
      filename: undefined;
    };

export const userInput: UserData = $state({
  kind: "text",
  data: "",
  filename: undefined,
});
