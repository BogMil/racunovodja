import {
  ExtractedEmployeeWithPageNumbers,
  IPdfParser
} from '../pdfParser.types';
import { getMonthNameCyr } from '../../../utils/getMonthName';
import { PLATNI_LISTIC } from '../../../constants/indikatoriFajlovaZaSlanje';
import { getLinesFromPage } from '../../../utils/pdfFileManipulations/getLinesFromPage';

export class PLv1PdfParser implements IPdfParser {
  async extractMonth(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);

    return parseInt(lines[10].substr(0, 2)).toString();
  }
  async extractYear(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    let godinaLine = lines[3].trim();
    let spacePos = godinaLine.indexOf(' ');

    return godinaLine.substr(spacePos + 1);
  }
  private _employee: ExtractedEmployeeWithPageNumbers = new ExtractedEmployeeWithPageNumbers();

  getFileType(): string {
    return PLATNI_LISTIC;
  }

  public async extractEmployees(
    page: any
  ): Promise<ExtractedEmployeeWithPageNumbers> {
    let lines = await getLinesFromPage(page);
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

    this._employee = new ExtractedEmployeeWithPageNumbers();
    setFullName(lines[1]);
    setNumber(lines[5]);
    setJmbg(lines[20]);
    setBancAccount(lines[7]);

    return this._employee;
  }

  public async extractSubject(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    let godinaLine = lines[3].trim();
    let spacePos = godinaLine.indexOf(' ');
    let godina = godinaLine.substr(spacePos + 1);
    let deoPlate = godinaLine.substr(0, spacePos);

    let mesec = parseInt(lines[10].substr(0, 2));
    return `Платни листић za ${getMonthNameCyr(
      mesec
    )}/${godina} - ${deoPlate}. део`;
  }

  public async isPageForNewEmployee(page: any): Promise<boolean> {
    try {
      let lines = await getLinesFromPage(page);
      return lines[15] == PLATNI_LISTIC;
    } catch (e) {
      return false;
    }
  }
}
