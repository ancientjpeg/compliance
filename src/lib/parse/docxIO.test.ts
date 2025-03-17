import { test, expect } from "vitest";
import fs from 'fs/promises'
import path from "path";
import { DocFile } from "./docxIO";

test("docx export operates as expected", async () => {

  const docPath = path.resolve('./src/lib/testData/test.docx');

  const docPathOut = path.join(path.dirname(docPath), 'testOut.docx');
  try {
    await fs.rm(docPathOut);
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      throw e
    }
  }

  const fbuf: Buffer = await fs.readFile(docPath)
  const docFile = new DocFile(new Blob([fbuf]));

  await docFile.forEachTextBlock((s: string) => {
    s = s + " AND OTHER STUFF || ";
    console.log(s);
    return s;
  });
  await docFile.forEachTextBlock((s: string) => {
    console.log(s);
    return s;
  });

  const outData = await docFile.getDataAsZip();

  /* jesus christ... now i see why they made deno */
  const data = Buffer.from(await outData.arrayBuffer());
  await fs.writeFile(docPathOut, data);

});
