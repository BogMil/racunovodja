import { Employee, IPdfParser } from '../pdfParser.types';
import { getMonthNameCyr } from '../../../utils/getMonthName';

export class ObustavaPdfParser implements IPdfParser {
  private _employee: Employee = new Employee();

  public extractEmployees(lines: string[]): Employee {
    let setFullName = (line: string) => {
      line = line.trim();
      let firstSpacePos = line.indexOf(' ');
      let fullName = line.substr(firstSpacePos + 1);
      let separator = fullName.lastIndexOf(' ');
      this._employee.last_name = fullName.substr(0, separator);
      this._employee.first_name = fullName.substr(separator + 1);
    };

    let setNumber = (line: string) => {
      line = line.trim();
      let firstSpacePos = line.indexOf(' ');
      this._employee.number = line.substr(0, firstSpacePos);
    };

    this._employee = new Employee();
    setFullName(lines[8]);
    setNumber(lines[8]);
    this._employee.banc_account = '';
    this._employee.jmbg = '';

    return this._employee;
  }

  public extractSubject(lines: string[]): string {
    let line = lines[6].trim();
    let dashPos = line.indexOf('-');
    let slashPos = line.indexOf('/');
    let mesec = parseInt(line.substr(0, dashPos));
    let deoPlate = line.substr(dashPos + 1, 1);
    let godina = line.substr(slashPos + 1);
    return `Рекапитулација обустава за ${getMonthNameCyr(
      mesec
    )}/${godina} - ${deoPlate}. део`;
  }
}
