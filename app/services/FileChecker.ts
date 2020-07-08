import { getLinesFromPage } from '../utils/pdfFileManipulations/getLinesFromPage';
import {
  PLATNI_LISTIC,
  OBUSTAVA
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
  public static async isPlatniListic(path: string) {
    let lines = await FileChecker.getFirstPageLines(path);
    return lines[15] == PLATNI_LISTIC;
  }

  public static async isObustava(path: string) {
    let lines = await FileChecker.getFirstPageLines(path);
    return lines[4] == OBUSTAVA;
  }
}
