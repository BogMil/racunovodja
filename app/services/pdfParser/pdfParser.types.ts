export class ExtractedEmployeeWithPageNumbers {
  public first_name: string = '';
  public last_name: string = '';
  public banc_account: string = '';
  public jmbg: string = '';
  public number: string = '';
  public pageNumbers: number[] = [];
}

export interface IPdfParser {
  extractEmployees(page: any): Promise<ExtractedEmployeeWithPageNumbers>;
  extractSubject(page: any): Promise<string>;
  getFileType(): string;
  isPageForNewEmployee(page: any): Promise<boolean>;
  extractYear(page: any): Promise<string>;
  extractMonth(page: any): Promise<string>;
}
