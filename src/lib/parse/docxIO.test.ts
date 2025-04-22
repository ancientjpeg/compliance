import { test, expect, describe, beforeEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { DocFile, forEachDocxXmlTextBlock } from './docxIO';
import stringReplace from '$lib/stringReplace';
import defaultReplacer from '$lib/defaultReplacer';

const testFiles = [
	path.resolve('./src/lib/testData/docxParserTestData.docx'),
	path.resolve('./src/lib/testData/docxParserTestDataSmall.docx')
];

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

test('XML Parser', async () => {
	const testXmlString = `\
<?xml version="1.0" encoding="UTF-8"?>
<w:document>
<w:t xml:space="preserve"> Text to replace </w:t>
<w:t> Text to 
replace </w:t>
<w:t> Text to keep </w:t>
</w:document>\r\n`;

	const expectedXmlString = `\
<?xml version="1.0" encoding="UTF-8"?>
<w:document>
<w:t xml:space="preserve"> Replaced text </w:t>
<w:t> Replaced 
text </w:t>
<w:t> Text to keep </w:t>
</w:document>\r\n`;

	const expectedStrings = [' Text to replace ', ' Text to \nreplace ', ' Text to keep '];
	let detectedStrings: string[] = [];
	const op = (s: string) => {
		detectedStrings.push(s);
		return s.replace(/Text to(.*?)replace/gms, 'Replaced$1text');
	};
	const newXml = forEachDocxXmlTextBlock(testXmlString, op);

	expect(detectedStrings).toStrictEqual(expectedStrings);
	expect(newXml).toStrictEqual(expectedXmlString);
});

describe.each(testFiles)('Docx', (filePath) => {
	let docPath: string, docPathComp: string, docPathOut: string;

	beforeEach(async () => {
		docPath = filePath;

		const suffix = '.docx';
		const pathBase = path.dirname(docPath) + '/' + path.basename(docPath, suffix);
		docPathComp = pathBase + 'Comp' + suffix;
		docPathOut = pathBase + 'Out' + suffix;
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

	test('file class copy does not corrupt text', async () => {
		let doc0 = await DocFile.createDocFile(await blobFromFile(docPath));
		let doc1 = await doc0.forEachTextBlock((s: string) => s.slice(0));

		let s0: string = doc0.documentXmlString;
		let s1: string = doc1.documentXmlString;
		expect(s0).toEqual(s1);
	});

	test('exporter does not corrupt text', async () => {
		let doc = await DocFile.createDocFile(await blobFromFile(docPath));
		const outData = await doc.getDataAsZip();
		await fs.writeFile(docPathOut, Buffer.from(await outData.arrayBuffer()));

		const docXmlStringFromFile = async (path: string) => {
			const blob = await blobFromFile(path);
			return await DocFile.documentXMLFromZip(blob);
		};

		const b0 = await docXmlStringFromFile(docPath);
		const b1 = await docXmlStringFromFile(docPathOut);
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
			expect.fail('Writing new comparison data for repository, please verify and re-run tests.');
		}

		expect(await getDocStrings(docPathOut)).toStrictEqual(await getDocStrings(docPathComp));
	});
});
