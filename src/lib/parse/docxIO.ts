import JSZip from 'jszip';

/**
 * Takes a string representing a .docx-compliant XML file and performs `fn`
 * on all visible text in the document. Returns a new string with the edits.
 */
export function forEachDocxXmlTextBlock(xml: string, fn: (s: string) => string): string {
	const re = new RegExp('(<w:t[^>]*>)(.*?)(</w:t>)', 'gms');
	let blocks: [number, number][] = [];
	for (const match of xml.matchAll(re)) {
		const start = match.index + match[1].length;
		const end = start + match[2].length;
		blocks.push([start, end]);
	}

	if (blocks.length === 0) {
		throw new Error('Found no .docx text tags in xml string');
	}

	let stringOut = xml.slice(0, blocks[0][0]);

	for (let i = 0; i < blocks.length; ++i) {
		const [start, end] = blocks[i];
		stringOut += fn(xml.slice(start, end));

		let suffixEnd = xml.length;
		if (i < blocks.length - 1) {
			suffixEnd = blocks[i + 1][0];
		}

		stringOut += xml.slice(end, suffixEnd);
	}

	return stringOut;
}

/**
 * A class encapsulating a .docx-file. Designed to be quasi-RAII, in that there
 * a DocFile is immutable, and any edits will create a new DocFile.
 */
export class DocFile {
	/**
	 * @note #data is not updated past ctor, it's just used as a reference point
	 * when reconstructing the docx zip.
	 */
	#data: Blob;
	#xmlString: string;
	static #docPath: string = 'word/document.xml';

	private constructor(data: Blob, xmlString: string) {
		this.#data = data;
		this.#xmlString = xmlString;
		this.#checkLoaded();
	}

	/**
	 * @returns The text of the word/document.xml file contained within the
	 * zip-encoded data contained in `fileData`.
	 */
	static async documentXMLFromZip(fileData: Blob): Promise<string> {
		const zipFile = await JSZip.loadAsync(await fileData.arrayBuffer());
		const doc = zipFile.file(DocFile.#docPath);
		if (doc === null) {
			throw Error('Unable to find expected document.xml in unzipped word doc');
		}

		return doc.async('text');
	}

	/* Create a DocFile. Takes ownership of fileData. */
	static async createDocFile(fileData: Blob): Promise<DocFile> {
		const xmlObject = await this.documentXMLFromZip(fileData);
		return new DocFile(fileData, xmlObject);
	}

	/**
	 * May throw iff `!this.loaded`. Returns a deep copy of `this`.
	 * `this` is not modified (DocFile is immutable).
	 */
	async forEachTextBlock(fn: (s: string) => string): Promise<DocFile> {
		this.#checkLoaded();
		const newData = this.#data.slice();
		const newXmlString = forEachDocxXmlTextBlock(this.#xmlString, fn);
		return new DocFile(newData, newXmlString);
	}

	async getText() {
		this.#checkLoaded();
		let ret: string = '';
		await this.forEachTextBlock((s) => {
			ret += s + '\n';
			return s;
		});
		return ret;
	}

	/* Converts the stored XML data to a string. */
	get documentXmlString(): string {
		this.#checkLoaded();
		return this.#xmlString;
	}

	/* Returns a blob containing the zip-encoded docx file with any modifications. */
	async getDataAsZip(): Promise<Blob> {
		const xmlDataString = this.documentXmlString;
		const zipFile = await JSZip.loadAsync(await this.#data.arrayBuffer());
		zipFile.file(DocFile.#docPath, xmlDataString);
		return zipFile.generateAsync({ type: 'blob', compression: 'DEFLATE' });
	}

	#checkLoaded() {
		if (this.#xmlString.length === 0) {
			throw new Error('DocFile is not loaded');
		}
	}
}
