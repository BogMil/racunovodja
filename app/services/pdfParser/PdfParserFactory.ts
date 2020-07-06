import { PLv1PdfParser } from './implementations/PLv1PdfParser';
import { InvalidFileException } from './exceptions/invalidFileException';
import { FileChecker } from '../FileChecker';
import { ObustavaPdfParser } from './implementations/ObustavaPdfParser';
import { IPdfParser } from './pdfParser.types';

const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export class PdfParserFactory {
  public static async ForFile(path: string): Promise<IPdfParser> {
    if (await FileChecker.isPlatniListic(path)) return new PLv1PdfParser();
    if (await FileChecker.isObustava(path)) return new ObustavaPdfParser();

    throw new InvalidFileException();
  }
}
