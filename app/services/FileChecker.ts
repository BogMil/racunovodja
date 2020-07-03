import { getLinesFromPage } from '../utils/pdfFileManipulations/getLinesFromPage';
import { PLATNI_LISTIC } from '../constants/indikatoriFajlovaZaSlanje';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class FileChecker {
  public static async isPlatniListic(path: string) {
    let doc = await pdfjs.getDocument(path).promise;

    let page = await doc.getPage(1);
    let lines = await getLinesFromPage(page);

    return lines[15] == PLATNI_LISTIC;
  }
}
