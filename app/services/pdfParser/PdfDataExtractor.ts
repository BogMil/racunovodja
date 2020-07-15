import { PdfParserFactory } from './PdfParserFactory';
import { ExtractedEmployeeWithPageNumbers } from './pdfParser.types';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class PdfDataExtractor {
  public async employees(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let employees: ExtractedEmployeeWithPageNumbers[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      let page = await doc.getPage(i);

      let employee = await pdfParser.extractEmployees(page);
      employee.pageNumbers.push(i);

      let nextPageNum = i + 1;
      if (nextPageNum > doc.numPages) {
        employees.push(employee);
        return employees;
      }

      while (!(await isPageForNewEmployee(nextPageNum))) {
        employee.pageNumbers.push(nextPageNum);
        nextPageNum++;
        if (nextPageNum > doc.numPages) {
          break;
        }
      }
      employees.push(employee);
      i = nextPageNum - 1;
    }
    return employees;

    async function isPageForNewEmployee(pageNum: number) {
      return await pdfParser.isPageForNewEmployee(await doc.getPage(pageNum));
    }
  }

  public async subjectAsync(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let page = await doc.getPage(1);
    return await pdfParser.extractSubject(page);
  }

  public async fileTypeAsync(path: string) {
    let pdfParser = await PdfParserFactory.ForFile(path);
    return pdfParser.getFileType();
  }

  public async yearAsync(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let page = await doc.getPage(1);

    return pdfParser.extractYear(page);
  }

  public async monthAsync(path: string) {
    let doc = await pdfjs.getDocument(path).promise;
    let pdfParser = await PdfParserFactory.ForFile(path);

    let page = await doc.getPage(1);
    return pdfParser.extractMonth(page);
  }
}
