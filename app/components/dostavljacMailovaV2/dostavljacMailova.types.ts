import { Zaposleni as DbEmployee } from '../zaposleni/zaposleni.types';

export type PodaciOSlanjuZaIzborZaposlenih = {
  filePath: string;
  zaposleniUFajlu: ZaposleniSaSifromIFajlom[];
};

export type PodaciOSlanjuZaSlanje = {
  filePath: string;
  odabraniZaposleni: DbEmployeeWithFile[];
  fileSubject: string;
  fileType: string;
  godina: string;
  nazivSkoleIzFajla: string;
};

export type DbEmployeeWithFile = {
  dbEmployee: DbEmployee;
  fajl: string;
};

export type RezultatSlanja = {
  zaposleni: string;
  message: string;
  uspesno: boolean;
};

export type ZaposleniSaSifromIFajlom = {
  sifra: string;
  fajl: string;
  ime: string;
  prezime: string;
};
