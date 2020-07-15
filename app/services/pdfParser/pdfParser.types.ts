export class ExtractedEmployeeWithPageNumbers {
  public first_name: string = '';
  public last_name: string = '';
  public banc_account: string = '';
  public jmbg: string = '';
  public number: string = '';
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
