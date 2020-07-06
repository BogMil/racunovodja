import { getLinesFromPage } from '../../utils/pdfFileManipulations/getLinesFromPage';
import { PdfParserFactory } from './PdfParserFactory';
import { Employee } from './pdfParser.types';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class PdfDataExtractor {
  public async employees(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let employees: Employee[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      let page = await doc.getPage(i);
      let lines = await getLinesFromPage(page);
      let employee = pdfParser.extractEmployees(lines);
      employees.push(employee);
    }

    return employees;
  }

  public async subject(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let page = await doc.getPage(1);
    let lines = await getLinesFromPage(page);
    return pdfParser.extractSubject(lines);
  }
}
