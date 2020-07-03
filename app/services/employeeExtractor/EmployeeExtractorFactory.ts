import { PLv1EmployeeExtractor } from './implementations/PLv1EmployeeExtractor';
import { IEmployeeExtractor } from './IEmployeeExtractor';
import { InvalidFileException } from './exceptions/invalidFileException';
import { FileChecker } from '../FileChecker';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class EmployeeExtractorFactory {
  public static async ForFile(path: string): Promise<IEmployeeExtractor> {
    if (FileChecker.isPlatniListic(path)) return new PLv1EmployeeExtractor();

    throw new InvalidFileException();
  }
}
