import {
  ExtractedEmployeeWithPageNumbers,
  IPdfParser
} from '../pdfParser.types';
import { PLATNI_LISTIC } from '../../../constants/indikatoriFajlovaZaSlanje';
import {
  getLinesFromPage,
  getTextFromPage
} from '../../../utils/pdfFileManipulations/getLinesFromPage';

export class PppPoObrazacPdfParser implements IPdfParser {
  async extractNazivSkoleAsync(page: any): Promise<string> {
    return '---';
  }
  async extractMonthAsync(page: any): Promise<string> {
    return '';
  }
  async extractYearAsync(page: any): Promise<string> {
    let text = await getTextFromPage(page);
    let startText = 'ПОТВРДА О ПЛАЋЕНИМ ПОРЕЗИМА И ДОПРИНОСИМА ПО ОДБИТКУ ЗА ';
    let startIndex = text.indexOf(startText) + startText.length;
    let y = text.substr(startIndex, 4);
    return y;
  }
  private _employee: ExtractedEmployeeWithPageNumbers = new ExtractedEmployeeWithPageNumbers();

  getFileType(): string {
    return PLATNI_LISTIC;
  }

  public async extractEmployeesAsync(
    page: any
  ): Promise<ExtractedEmployeeWithPageNumbers> {
    this._employee = new ExtractedEmployeeWithPageNumbers();
    var jmbgRegexPattern = /\d{13}/g;
    let jmbgRegex = new RegExp(jmbgRegexPattern);
    let lines = await getLinesFromPage(page);

    for (let line of lines) {
      if (!jmbgRegex.test(line)) continue;
      let jmbgMatched = jmbgRegexPattern.exec(line) as Array<any>;
      if (!this.isValidJMBG(jmbgMatched[0])) continue;
      this._employee.jmbg = jmbgMatched[0];
      break;
    }
    if (!this.isValidJMBG(this._employee.jmbg))
      alert(
        `Nije moguce obraditi stranicu broj ${page.pageIndex}. Tu stranicu sistem nece moci da posalje automatski`
      );

    return this._employee;
  }

  public async extractSubjectAsync(page: any): Promise<string> {
    return `PPP PO - ${await this.extractYearAsync(page)}`;
  }

  public async isPageForNewEmployeeAsync(page: any): Promise<boolean> {
    return true;
  }

  isValidJMBG = (jmbg: any) => {
    if (jmbg.length === 13) {
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const arrJMBG = jmbg.split('');
      //check_birthyear
      let birthYear = arrJMBG.slice(4, 7).join('');
      if (birthYear[0] === '0') {
        birthYear = Number(birthYear) + 2000;
      } else if (birthYear[0] === '9') {
        birthYear = Number(birthYear) + 1000;
      } else {
        return false;
      }
      //check month
      const birthMonth = arrJMBG.slice(2, 4).join('');
      if (birthMonth > 12 || birthMonth < 1) {
        return false;
      }
      //check leap year and set number of days in february
      if (
        birthYear % 4 === 0 &&
        (birthYear % 100 !== 0 || birthYear % 400 === 0)
      ) {
        // prestupna godina
        daysInMonth[1] = 29;
      }

      //check if birth date is valid
      const birthDate = arrJMBG.slice(0, 2).join('');
      if (birthDate > daysInMonth[birthMonth - 1] || birthDate < 1) {
        return false;
      }

      //check control number

      let controlNumber =
        11 -
        ((7 * (Number(arrJMBG[0]) + Number(arrJMBG[6])) +
          6 * (Number(arrJMBG[1]) + Number(arrJMBG[7])) +
          5 * (Number(arrJMBG[2]) + Number(arrJMBG[8])) +
          4 * (Number(arrJMBG[3]) + Number(arrJMBG[9])) +
          3 * (Number(arrJMBG[4]) + Number(arrJMBG[10])) +
          2 * (Number(arrJMBG[5]) + Number(arrJMBG[11]))) %
          11);
      if (controlNumber > 9) controlNumber = 0;

      if (controlNumber !== Number(arrJMBG[12])) {
        return false;
      }

      return true;
    }
  };
}
