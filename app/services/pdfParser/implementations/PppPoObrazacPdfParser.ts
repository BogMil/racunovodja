import {
  ExtractedEmployeeWithPageNumbers,
  IPdfParser
} from '../pdfParser.types';
import { getMonthNameCyr } from '../../../utils/getMonthName';
import { PLATNI_LISTIC } from '../../../constants/indikatoriFajlovaZaSlanje';
import { getLinesFromPage } from '../../../utils/pdfFileManipulations/getLinesFromPage';

export class PppPoObrazacPdfParser implements IPdfParser {
  async extractNazivSkoleAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    return lines[4].trim();
  }
  async extractMonthAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);

    return parseInt(lines[10].substr(0, 2)).toString();
  }
  async extractYearAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    let godinaLine = lines[3].trim();
    let spacePos = godinaLine.indexOf(' ');

    return godinaLine.substr(spacePos + 1);
  }
  private _employee: ExtractedEmployeeWithPageNumbers = new ExtractedEmployeeWithPageNumbers();

  getFileType(): string {
    return PLATNI_LISTIC;
  }

  public async extractEmployeesAsync(
    page: any
  ): Promise<ExtractedEmployeeWithPageNumbers> {
    let lines = await getLinesFromPage(page);
    debugger;
    let setFullName = (line: string) => {
      let separator = line.lastIndexOf(' ');
      this._employee.prezime = line.substr(0, separator);
      this._employee.ime = line.substr(separator + 1);
    };

    let setJmbg = (line: string) => {
      this._employee.jmbg = line[14];
    };

    let setBancAccount = (line: string) => {
      this._employee.bankovni_racun = line;
    };

    this._employee = new ExtractedEmployeeWithPageNumbers();
    setFullName(lines[1]);
    this._employee.sifra = '';
    lines[20] == 'УПРАВА ЗА ТРЕЗОР' ? setJmbg(lines[21]) : setJmbg(lines[20]);
    setBancAccount(lines[7]);

    return this._employee;
  }

  public async extractSubjectAsync(page: any): Promise<string> {
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

  public async isPageForNewEmployeeAsync(page: any): Promise<boolean> {
    try {
      let lines = await getLinesFromPage(page);
      return lines[15] == PLATNI_LISTIC;
    } catch (e) {
      return false;
    }
  }
}
