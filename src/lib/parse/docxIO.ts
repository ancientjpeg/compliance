import * as xml from 'fast-xml-parser';
import JSZip from 'jszip';

function isProperObject(object: any) {
	if (object === null) {
		return false;
	} else if (Array.isArray(object)) {
		return false;
	}

	return typeof object === 'object';
}

function forEachStringWithMatchingKey(object: any, keys: string[], fn: (s: string) => string): any {
	for (const k in object) {
		const v: any = object[k];
		if (Array.isArray(v)) {
			object[k] = v.map((av) => forEachStringWithMatchingKey(av, keys, fn));
		} else if (isProperObject(v)) {
			object[k] = forEachStringWithMatchingKey(v, keys, fn);
		} else if (keys.includes(k) && typeof v === 'string') {
			object[k] = fn(v);
		} else {
			if (typeof v !== 'string' || k.substring(0, 2) != '@_') {
				if (typeof v !== 'number') {
					throw new Error(
						`Encountered unexpected XML value when parsing docx document: { "${k}", "${v}" }, typeof v: ${typeof v}`
					);
				}
			}
		}
	}
	return object;
}

export class DocFile {
	/**
	 * @note #data is not updated past ctor, it's just used as a reference point
	 * when reconstructing the docx zip.
	 */

	#data: Blob;
	#xmlJObj: any;
	static #docPath: string = 'word/document.xml';
	static #xmlOptions: any = {
		ignoreAttributes: false,
		attributeNamePrefix: '@_',
		trimValues: false,
		preserveOrder: true,
		suppressEmptyNode: true
	};

	private constructor(data: Blob, xmlJObj: any) {
		this.#data = data;
		this.#xmlJObj = xmlJObj;
		this.#checkLoaded();
	}

	/* Gets document XML as a string from a docx zip blob. separated from `createDocFile` for testing. */
	static async docXMLDataFromZipBlob(fileData: Blob): Promise<string> {
		const zipFile = await JSZip.loadAsync(await fileData.arrayBuffer());
		const doc = zipFile.file(DocFile.#docPath);
		if (doc === null) {
			throw Error('Unable to find expected document.xml in unzipped word doc');
		}

		return doc.async('text');
	}

	/* Create a DocFile. Takes ownership of fileData. */
	static async createDocFile(fileData: Blob): Promise<DocFile> {
		const docTextPromise = this.docXMLDataFromZipBlob(fileData);
		const parser = new xml.XMLParser(DocFile.#xmlOptions);
		const xmlObject: any = parser.parse(await docTextPromise);
		return new DocFile(fileData, xmlObject);
	}

	/** May throw iff `!this.loaded`. Returns a deep copy of `this` */
	async forEachTextBlock(fn: (s: string) => string): Promise<DocFile> {
		this.#checkLoaded();
		const newData = this.#data.slice();
		const newXml = JSON.parse(JSON.stringify(this.#xmlJObj));
		const d = new DocFile(newData, newXml);
		d.#xmlJObj = forEachStringWithMatchingKey(d.#xmlJObj, ['w:t', '#text'], fn);
		return d;
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
	getDocumentXMLString(): string {
		this.#checkLoaded();
		const builder = new xml.XMLBuilder(DocFile.#xmlOptions);
		let xmlString: string = builder.build(this.#xmlJObj);

		/* Mostly for tests passing, but we want to make sure the docx replacer has no effect for unaffected docs. */
		const insertIndex = xmlString.indexOf('>') + 1;
		xmlString = xmlString.slice(0, insertIndex) + '\n' + xmlString.slice(insertIndex) + '\n';

		return xmlString;
	}

	async getDataAsZip(): Promise<Blob> {
		const xmlDataString = this.getDocumentXMLString();
		const zipFile = await JSZip.loadAsync(await this.#data.arrayBuffer());
		zipFile.file(DocFile.#docPath, xmlDataString);
		return zipFile.generateAsync({ type: 'blob' });
	}

	#checkLoaded() {
		if (!this.#xmlJObj || Object.keys(this.#xmlJObj).length === 0) {
			throw new Error('DocFile is not loaded');
		}
	}
}
