import { getLinesFromPage } from '../../utils/pdfFileManipulations/getLinesFromPage';
import { PLv1EmployeeExtractor } from './implementations/PLv1EmployeeExtractor';
import { IEmployeeExtractor } from './IEmployeeExtractor';
import { InvalidFileException } from './exceptions/invalidFileException';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class EmployeeExtractorFactory {
  public static async ForFile(path: string): Promise<IEmployeeExtractor> {
    let doc = await pdfjs.getDocument(path).promise;

    let page = await doc.getPage(1);
    let lines = await getLinesFromPage(page);

    if (lines[15] == 'ИСПЛАТНИ ЛИСТИЋ') return new PLv1EmployeeExtractor();

    throw new InvalidFileException();
  }
}
