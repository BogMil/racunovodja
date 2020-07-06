import { Employee, IPdfParser } from '../pdfParser.types';
import { getMonthNameCyr } from '../../../utils/getMonthName';

export class PLv1PdfParser implements IPdfParser {
  private _employee: Employee = new Employee();

  public extractEmployees(lines: string[]): Employee {
    let setFullName = (line: string) => {
      let separator = line.lastIndexOf(' ');
      this._employee.last_name = line.substr(0, separator);
      this._employee.first_name = line.substr(separator + 1);
    };

    let setNumber = (line: string) => {
      this._employee.number = line.trim();
    };

    let setJmbg = (line: string) => {
      this._employee.jmbg = line.substr(0, 13);
    };

    let setBancAccount = (line: string) => {
      this._employee.banc_account = line;
    };

    this._employee = new Employee();
    setFullName(lines[1]);
    setNumber(lines[5]);
    setJmbg(lines[20]);
    setBancAccount(lines[7]);

    return this._employee;
  }

  public extractSubject(lines: string[]): string {
    let godinaLine = lines[3].trim();
    let spacePos = godinaLine.indexOf(' ');
    let godina = godinaLine.substr(spacePos + 1);
    let deoPlate = godinaLine.substr(0, spacePos);

    let mesec = parseInt(lines[10].substr(0, 2));
    return `Платни листић za ${getMonthNameCyr(
      mesec
    )}/${godina} - ${deoPlate}. део`;
  }
}
