export class Employee {
  public first_name: string = '';
  public last_name: string = '';
  public banc_account: string = '';
  public jmbg: string = '';
  public number: string = '';
}

export interface IPdfParser {
  extractEmployees(lines: string[]): Employee;
  extractSubject(lines: string[]): string;
}
