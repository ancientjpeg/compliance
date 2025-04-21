import { test, expect, describe, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { DocFile } from './docxIO';
import stringReplace from '$lib/stringReplace';
import defaultReplacer from '$lib/defaultReplacer';

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

const docPath = path.resolve('./src/lib/testData/docxParserTestData.docx');
const docPathOut = path.join(path.dirname(docPath), 'docxParserOutData.docx');
const docPathComp = path.join(path.dirname(docPath), 'docxParserCompData.docx');

beforeEach(async () => {
	console.log('BEFORE!');

	expect(docPath).not.toEqual(docPathOut);
	expect(docPath).not.toEqual(docPathComp);

	if (await fileExists(docPathOut)) {
		await fs.rm(docPathOut);
	}
});

/** @todo refactor this tests to test more than just stringReplace */
describe('Docx', () => {
	test('exporter does not corrupt text', () => {});
	test('export operates as expected with stringReplace', async () => {
		const fbuf: Buffer = await fs.readFile(docPath);
		const docFile = await DocFile.createDocFile(new Blob([fbuf]));

		const docFileReplaced = (await stringReplace(docFile, defaultReplacer)) as DocFile;

		const outData = await docFileReplaced.getDataAsZip();

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
