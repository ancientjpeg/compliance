import JSZip from 'jszip';

export function forEachTextBlockInXMLString(xml: string, fn: (s: string) => string): string {
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

	static async docXMLBlobFromZipBlob(fileData: Blob): Promise<Blob> {
		const zipFile = await JSZip.loadAsync(await fileData.arrayBuffer());
		const doc = zipFile.file(DocFile.#docPath);
		if (doc === null) {
			throw Error('Unable to find expected document.xml in unzipped word doc');
		}

		return doc.async('blob');
	}

	/* Gets document XML as a string from a docx zip blob. separated from `createDocFile` for testing. */
	static async docXMLDataFromZipBlob(fileData: Blob): Promise<string> {
		return (await DocFile.docXMLBlobFromZipBlob(fileData)).text();
	}

	/* Create a DocFile. Takes ownership of fileData. */
	static async createDocFile(fileData: Blob): Promise<DocFile> {
		const xmlObject = await this.docXMLDataFromZipBlob(fileData);
		return new DocFile(fileData, xmlObject);
	}

	/** May throw iff `!this.loaded`. Returns a deep copy of `this` */
	async forEachTextBlock(fn: (s: string) => string): Promise<DocFile> {
		this.#checkLoaded();
		const newData = this.#data.slice();
		const newXmlString = forEachTextBlockInXMLString(this.#xmlString, fn);
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
