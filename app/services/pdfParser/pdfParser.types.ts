export class ExtractedEmployeeWithPageNumbers {
  public ime: string = '';
  public prezime: string = '';
  public bankovni_racun: string = '';
  public jmbg: string = '';
  public sifra: string = '';
  public pageNumbers: number[] = [];
}

export interface IPdfParser {
  extractEmployeesAsync(page: any): Promise<ExtractedEmployeeWithPageNumbers>;
  extractSubjectAsync(page: any): Promise<string>;
  getFileType(): string;
  isPageForNewEmployeeAsync(page: any): Promise<boolean>;
  extractYearAsync(page: any): Promise<string>;
  extractMonthAsync(page: any): Promise<string>;
  extractNazivSkoleAsync(page: any): Promise<string>;
}
