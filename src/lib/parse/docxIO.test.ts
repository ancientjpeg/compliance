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

	// return async () => {
	// 	await rmOutFile();
	// };
});

describe('Docx', () => {
	test('exporter does not corrupt text', async () => {
		let doc0 = await DocFile.createDocFile(await blobFromFile(docPath));
		let doc1 = await doc0.forEachTextBlock((s: string) => s.slice(0));

		let s0: string = doc0.getDocumentXMLString();
		let s1: string = doc1.getDocumentXMLString();
		expect(s0).toEqual(s1);

		const outData = await doc1.getDataAsZip();
		await fs.writeFile(docPathOut, Buffer.from(await outData.arrayBuffer()));

		const bytesFromDocXML = async (path: string) => {
			return await (await DocFile.docXMLBlobFromZipBlob(await blobFromFile(path))).bytes();
		};

		const b0 = await bytesFromDocXML(docPath);
		const b1 = await bytesFromDocXML(docPathOut);
		expect(b0.byteLength).toStrictEqual(b1.byteLength);
		expect(b0).toStrictEqual(b1);
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
