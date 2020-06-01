import { Employee } from '../employeeExtractor.types';
import { IEmployeeExtractor } from '../IEmployeeExtractor';

export class PLv1EmployeeExtractor implements IEmployeeExtractor {
  private _employee: Employee = new Employee();

  public extract(lines: string[]): Employee {
    this._employee = new Employee();
    this.setFullName(lines[1]);
    this.setNumber(lines[5]);
    this.setJmbg(lines[20]);
    this.setBancAccount(lines[7]);

    return this._employee;
  }
  private setFullName = (line: string) => {
    let separator = line.lastIndexOf(' ');
    this._employee.last_name = line.substr(0, separator);
    this._employee.first_name = line.substr(separator + 1);
  };

  private setNumber = (line: string) => {
    this._employee.number = line;
  };

  private setJmbg = (line: string) => {
    this._employee.jmbg = line.substr(0, 13);
  };

  private setBancAccount = (line: string) => {
    this._employee.banc_account = line;
  };
}
