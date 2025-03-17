import * as xml from 'fast-xml-parser'
import JSZip from 'jszip'

function isProperObject(object: any) {
  if (object === null) {
    return false;
  } else if (Array.isArray(object)) {
    return false;
  }


  return typeof object === 'object';
}

function forEachStringWithMatchingKey(object: any, key: string, fn: (s: string) => string): any {

  for (const k in object) {
    const v: any = object[k];
    if (Array.isArray(v)) {
      object[k] = v.map(av => forEachStringWithMatchingKey(av, key, fn));
    } else if (isProperObject(v)) {
      object[k] = forEachStringWithMatchingKey(v, key, fn);
    } else if (key == k && typeof v === 'string') {
      object[k] = fn(v);
    }

  }
  return object;
}

export class DocFile {
  /** 
   * @note #data is not updated past ctor, it's just used as a reference point
   * when reconstructing the docx zip.
   */

  #data: Blob
  #xmlJObj: any;
  static #docPath: string = 'word/document.xml';
  static #xmlOptions: any = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  };


  private constructor(data: Blob, xmlJObj: any) {
    this.#data = data;
    this.#xmlJObj = xmlJObj;
    this.#checkLoaded();
  }

  /* Create a DocFile. Takes ownership of fileData. */
  static async createDocFile(fileData: Blob): Promise<DocFile> {

    const zipFile = await JSZip.loadAsync(await fileData.arrayBuffer());
    const doc = zipFile.file(DocFile.#docPath);
    if (doc === null) {
      throw Error("Unable to find expected document.xml in unzipped word doc");
    }

    const docTextPromise = doc.async('text');
    const parser = new xml.XMLParser(DocFile.#xmlOptions);
    const xmlObject: any = parser.parse(await docTextPromise);
    return new DocFile(fileData, xmlObject);
  }

  /** May throw iff `!this.loaded`. Returns a copy of `this` */
  async forEachTextBlock(fn: (s: string) => string): Promise<DocFile> {
    this.#checkLoaded();
    /** TS compiler can't tell but this is guaranteed to exist now */
    const newData = this.#data.slice();
    const newXml = JSON.parse(JSON.stringify(this.#xmlJObj));
    const d = new DocFile(newData, newXml);
    d.#xmlJObj = forEachStringWithMatchingKey(d.#xmlJObj, "w:t", fn);
    return d;
  }

  async getText() {
    this.#checkLoaded();
    let ret: string = '';
    await this.forEachTextBlock(s => {
      ret += s;
      return s;
    });
    return ret;
  }

  async getDataAsZip(): Promise<Blob> {
    this.#checkLoaded();
    const builder = new xml.XMLBuilder(DocFile.#xmlOptions);
    const xmlDataString = builder.build(this.#xmlJObj);

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

