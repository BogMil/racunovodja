import {
  getLinesFromPage,
  getTextFromPage
} from '../utils/pdfFileManipulations/getLinesFromPage';
import {
  PLATNI_LISTIC,
  OBUSTAVA,
  PPP_PO_OBRAZAC
} from '../constants/indikatoriFajlovaZaSlanje';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class FileChecker {
  private static async getFirstPageLines(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let page = await doc.getPage(1);
    return await getLinesFromPage(page);
  }

  private static async getPageText(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let page = await doc.getPage(1);
    return await getTextFromPage(page);
  }

  public static async isPlatniListic(path: string) {
    let lines = await FileChecker.getFirstPageLines(path);
    return lines[15] == PLATNI_LISTIC;
  }

  public static async isObustava(path: string) {
    let lines = await FileChecker.getFirstPageLines(path);
    return lines[4] == OBUSTAVA;
  }

  public static async isPppPoObrazac(path: string) {
    let doc = await FileChecker.getPageText(path);
    return doc.includes(PPP_PO_OBRAZAC);
  }
}
