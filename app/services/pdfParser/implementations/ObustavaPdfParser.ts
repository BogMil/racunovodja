import {
  ExtractedEmployeeWithPageNumbers,
  IPdfParser
} from '../pdfParser.types';
import { getMonthNameCyr } from '../../../utils/getMonthName';
import { OBUSTAVA } from '../../../constants/indikatoriFajlovaZaSlanje';
import { getLinesFromPage } from '../../../utils/pdfFileManipulations/getLinesFromPage';

export class ObustavaPdfParser implements IPdfParser {
  async extractNazivSkoleAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    return lines[5].trim();
  }
  async extractYearAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    let line = lines[6].trim();
    let slashPos = line.indexOf('/');
    let godina = line.substr(slashPos + 1);
    return godina;
  }
  async extractMonthAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);
    let line = lines[6].trim();
    let dashPos = line.indexOf('-');
    let mesec = parseInt(line.substr(0, dashPos));
    return mesec.toString();
  }
  getFileType(): string {
    return OBUSTAVA;
  }

  private _employee: ExtractedEmployeeWithPageNumbers = new ExtractedEmployeeWithPageNumbers();

  public async extractEmployeesAsync(
    page: any
  ): Promise<ExtractedEmployeeWithPageNumbers> {
    let lines = await getLinesFromPage(page);

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

    this._employee = new ExtractedEmployeeWithPageNumbers();
    setFullName(lines[8]);
    setNumber(lines[8]);
    this._employee.banc_account = '';
    this._employee.jmbg = '';

    return this._employee;
  }

  public async extractSubjectAsync(page: any): Promise<string> {
    let lines = await getLinesFromPage(page);

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

  public async isPageForNewEmployeeAsync(page: any): Promise<boolean> {
    try {
      let lines = await getLinesFromPage(page);
      return lines[4] == OBUSTAVA;
    } catch (e) {
      return false;
    }
  }
}
