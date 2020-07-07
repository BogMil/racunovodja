import { ExtractedEmployeeWithPageNumbers } from '../../services/pdfParser/pdfParser.types';
import { Employee as DbEmployee } from '../employees/types';

export type PodaciOSlanjuZaIzborZaposlenih = {
  filePath: string;
  zaposleniUFajlu: ExtractedEmployeeWithPageNumbers[];
};

export type PodaciOSlanjuZaSlanje = {
  filePath: string;
  odabraniZaposleni: DbEmployeeWithPages[];
  fileSubject: string;
};

export type DbEmployeeWithPages = {
  dbEmployee: DbEmployee;
  pageNumbers: number[];
};
