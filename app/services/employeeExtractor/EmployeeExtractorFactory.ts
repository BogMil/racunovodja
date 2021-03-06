import { FileChecker } from '../FileChecker';
import { IPdfParser } from '../pdfParser/pdfParser.types';
import { PLv1PdfParser } from '../pdfParser/implementations/PLv1PdfParser';
import { ObustavaPdfParser } from '../pdfParser/implementations/ObustavaPdfParser';
import { InvalidFileException } from '../pdfParser/exceptions/invalidFileException';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class EmployeeExtractorFactory {
  public static async ForFile(path: string): Promise<IPdfParser> {
    if (await FileChecker.isPlatniListic(path)) return new PLv1PdfParser();
    if (await FileChecker.isObustava(path)) return new ObustavaPdfParser();

    throw new InvalidFileException();
  }
}
