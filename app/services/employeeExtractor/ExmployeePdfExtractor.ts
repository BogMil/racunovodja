import { getLinesFromPage } from '../../utils/pdfFileManipulations/getLinesFromPage';
import { EmployeeExtractorFactory } from './EmployeeExtractorFactory';
import { Employee } from './employeeExtractor.types';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class PdfEmployeeExtractor {
  public async extractFromFile(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let employeeExtractor = await EmployeeExtractorFactory.ForFile(path);

    let employees: Employee[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      let page = await doc.getPage(i);
      let lines = await getLinesFromPage(page);
      let employee = employeeExtractor.extract(lines);
      employees.push(employee);
    }

    return employees;
  }
}
