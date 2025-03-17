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
  #zipFile: JSZip | null = null;
  #fileData: Blob;
  #xmlJObj: any;
  #docPath: string
  #xmlOptions: any

  private constructor(fileData: Blob) {
    this.#fileData = fileData;
    this.#xmlJObj = null;
    this.#docPath = 'word/document.xml';
    this.#xmlOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    };
  }



  /** 
   * @brief Loads the passed docx file blob into memory by unzipping it
   */
  static async createDocFile(fileData: Blob) : Promise<DocFile> {
    const d = new DocFile(fileData);

    const data = await d.#fileData.arrayBuffer();
    d.#zipFile = await JSZip.loadAsync(data);

    /* TS doesn't know, but #zipFile is guaranteed to exist here */
    const doc = d.#zipFile!.file(d.#docPath);
    if (doc === null) {
      throw Error("Unable to find expected document.xml in unzipped word doc");
    }

    const docTextPromise = doc.async('text');

    const parser = new xml.XMLParser(d.#xmlOptions);

    d.#xmlJObj = parser.parse(await docTextPromise);

    if (!d.loaded) {
      throw Error("XML parse failed");
    }

    return d;

  }

  /** May throw iff `!this.loaded` */
  async forEachTextBlock(fn: (s: string) => string) {
    this.#checkLoaded();
    /** TS compiler can't tell but this is guaranteed to exist now */
    this.#xmlJObj = forEachStringWithMatchingKey(this.#xmlJObj, "w:t", fn);

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
    const builder = new xml.XMLBuilder(this.#xmlOptions);
    const xmlDataString = builder.build(this.#xmlJObj);
    this.#zipFile!.file(this.#docPath, xmlDataString);
    return this.#zipFile!.generateAsync({ type: 'blob' });

  }

  get loaded(): boolean {
    return this.#xmlJObj && Object.keys(this.#xmlJObj).length !== 0
  }

  #checkLoaded() {
    if (!this.loaded) {
      throw new Error('DocFile is not loaded');
    }
  }


}

