import { Employee } from '../../services/pdfParser/pdfParser.types';

export type PodaciOSlanju = {
  filePath: string;
  zaposleniUFajlu: Employee[];
};
