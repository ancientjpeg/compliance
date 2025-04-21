import { test, expect, describe, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { DocFile } from './docxIO';
import stringReplace from '$lib/stringReplace';
import defaultReplacer from '$lib/defaultReplacer';
import * as xml from 'fast-xml-parser';

const getDocStrings = async (path: string): Promise<Array<string>> => {
	const buf: Buffer = await fs.readFile(path);
	const strings = new Array<string>();
	const doc = await DocFile.createDocFile(new Blob([buf]));
	await doc.forEachTextBlock((s: string) => {
		strings.push(s);
		return s;
	});

	return strings;
};

const fileExists = async (path: string) => {
	try {
		await fs.stat(path);
	} catch (e: any) {
		if (e.code !== 'ENOENT') {
			throw e;
		}
		return false;
	}
	return true;
};

const blobFromFile = async (path: string): Promise<Blob> => {
	const fbuf: Buffer = await fs.readFile(path);
	return new Blob([fbuf]);
};

const performOpOnDocument = async (
	path: string,
	op: (doc: DocFile) => Promise<DocFile>
): Promise<Blob> => {
	const docFile = await DocFile.createDocFile(await blobFromFile(path));

	const docFileReplaced = await op(docFile);
	return docFileReplaced.getDataAsZip();
};

const docPath = path.resolve('./src/lib/testData/docxParserTestData.docx');
const docPathOut = path.join(path.dirname(docPath), 'docxParserOutData.docx');
const docPathComp = path.join(path.dirname(docPath), 'docxParserCompData.docx');

beforeEach(async () => {
	expect(docPath).not.toEqual(docPathOut);
	expect(docPath).not.toEqual(docPathComp);

	const rmOutFile = async () => {
		if (await fileExists(docPathOut)) {
			await fs.rm(docPathOut);
		}
	};

	await rmOutFile();

	return async () => {
		await rmOutFile();
	};
});

test('XML test', async () => {
	const opts = {
		ignoreAttributes: false,
		attributeNamePrefix: '@_',
		trimValues: false
		// preserveOrder: true
	};
	const xmlString =
		'<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" mc:Ignorable="w14"><w:body><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>diversity Equity and EQUITY</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>this is one paragraph</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>this is another paragraph</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>and a third or fourth paragraph.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="Body A"></w:pStyle></w:pPr><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t xml:space="preserve">and some </w:t></w:r><w:r><w:rPr><w:b w:val="1"></w:b><w:bCs w:val="1"></w:bCs><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>bold</w:t></w:r><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t xml:space="preserve"> and </w:t></w:r><w:r><w:rPr><w:i w:val="1"></w:i><w:iCs w:val="1"></w:iCs><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>italic</w:t></w:r><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t xml:space="preserve"> and </w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Hack Regular" w:hAnsi="Hack Regular"></w:rFonts><w:sz w:val="16"></w:sz><w:szCs w:val="16"></w:szCs><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t>different</w:t></w:r><w:r><w:rPr><w:rtl w:val="0"></w:rtl><w:lang w:val="en-US"></w:lang></w:rPr><w:t xml:space="preserve"> text</w:t></w:r></w:p><w:sectPr><w:headerReference w:type="default" r:id="rId4"></w:headerReference><w:footerReference w:type="default" r:id="rId5"></w:footerReference><w:pgSz w:w="12240" w:h="15840" w:orient="portrait"></w:pgSz><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="864"></w:pgMar><w:bidi w:val="0"></w:bidi></w:sectPr></w:body></w:document>';
	const p = new xml.XMLParser(opts);
	const b = new xml.XMLBuilder(opts);

	const xo = p.parse(xmlString);
	const out = b.build(xo);

	expect(xmlString).toEqual(out);
});

describe('Docx', () => {
	test('exporter does not corrupt text', async () => {
		let doc0 = await DocFile.createDocFile(await blobFromFile(docPath));
		let doc1 = await doc0.forEachTextBlock((s: string) => s.slice(0));

		let s0 = doc0.getDocumentXMLString();
		let s1 = doc1.getDocumentXMLString();
		expect(s0).toEqual(s1);

		const outData = await doc1.getDataAsZip();
		await fs.writeFile(docPathOut, Buffer.from(await outData.arrayBuffer()));

		s0 = await DocFile.docXMLDataFromZipBlob(await blobFromFile(docPath));
		s1 = await DocFile.docXMLDataFromZipBlob(await blobFromFile(docPathOut));
		expect(s0).toEqual(s1);
	});

	test('export operates as expected with stringReplace', async () => {
		const op = async (d: DocFile) => {
			return stringReplace(d, defaultReplacer) as Promise<DocFile>;
		};

		const outData = await performOpOnDocument(docPath, op);

		let compDataExists = await fileExists(docPathComp);
		/* jesus christ... now i see why they made deno */
		const data = Buffer.from(await outData.arrayBuffer());
		await fs.writeFile(docPathOut, data);
		if (!compDataExists) {
			await fs.writeFile(docPathComp, data);
		}

		expect(await getDocStrings(docPathOut)).toStrictEqual(await getDocStrings(docPathComp));
	});
});
