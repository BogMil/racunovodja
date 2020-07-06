import { Employee } from '../../services/pdfParser/pdfParser.types';
import { Employee as DbEmployee } from '../employees/types';

export type PodaciOSlanjuZaIzborZaposlenih = {
  filePath: string;
  zaposleniUFajlu: Employee[];
};

export type PodaciOSlanjuZaSlanje = {
  filePath: string;
  odabraniZaposleni: DbEmployee[];
  fileSubject: string;
};
