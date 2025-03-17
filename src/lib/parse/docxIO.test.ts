import { test, expect } from "vitest";
import fs from 'fs/promises'
import path from "path";
import { DocFile } from "./docxIO";

test("docx export operates as expected", async () => {

  const docPath = path.resolve('./src/lib/testData/docxParserTestData.docx');
  const docPathOut = path.join(path.dirname(docPath), 'docxParserOutData.docx');
  const docPathComp = path.join(path.dirname(docPath), 'docxParserCompData.docx');

  expect(docPath).not.toEqual(docPathOut);
  expect(docPath).not.toEqual(docPathComp);

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
    s = s + " ENDL";
    return s;
  });

  const outData = await docFile.getDataAsZip();

  let compDataExists = true
  try {
    fs.stat(docPathComp)
  } catch (e: any) {
    if (e.code !== "ENOENT") {
      throw e
    }
    return compDataExists = false;
  }

  /* jesus christ... now i see why they made deno */
  const data = Buffer.from(await outData.arrayBuffer());
  await fs.writeFile(docPathOut, data);
  if (!compDataExists) {
    await fs.writeFile(docPathComp, data);
  }

  const getDocStrings = async (path: string): Promise<Array<string>> => {
    const buf: Buffer = await fs.readFile(path);
    const strings = new Array<string>();
    const doc = new DocFile(new Blob([buf]));
    await doc.forEachTextBlock((s: string) => {
      strings.push(s);
      return s;
    });

    return strings;
  }


  expect(await getDocStrings(docPathOut)).toStrictEqual(await getDocStrings(docPathComp));


});
