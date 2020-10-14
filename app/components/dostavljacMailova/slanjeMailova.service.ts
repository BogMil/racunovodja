import { DbEmployeeWithPages } from './dostavljacMailova.types';
import { PDFDocument } from 'pdf-lib';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { MailSender } from '../../services/mailSender/mailSender';
import axios from 'axios';
import { BASE_URL } from '../../config';
const fs = require('fs');

export class SlanjeMailovaService {
  private _subject: string;
  private _mailSender: MailSender;
  private _izvorniPdfFajl: PDFDocument;
  private _filePath: string;
  private _user: string;
  private _pass: string;

  constructor(config: { filePath: string; user: string; pass: string }) {
    this._mailSender = new MailSender();
    this._filePath = config.filePath;
    this._user = config.user;
    this._pass = config.pass;
  }

  private async _initAsync() {
    let filePdfBytes = fs.readFileSync(this._filePath);
    this._izvorniPdfFajl = await PDFDocument.load(filePdfBytes);
    this._subject = await new PdfDataExtractor().subjectAsync(this._filePath);
    await this._mailSender.initAsync(this._user, this._pass);
  }

  public async posaljiEmailoveZaposlenima(config: {
    listaZaposlenih: DbEmployeeWithPages[];
    onSuccess: (zaposleni: DbEmployeeWithPages) => void;
    onFail: (zaposleni: DbEmployeeWithPages, e: any) => void;
  }) {
    try {
      await this._initAsync();
      for (let zaposleni of config.listaZaposlenih) {
        try {
          await this._posaljiEmailZaposlenom(zaposleni);
          config.onSuccess(zaposleni);
        } catch (e) {
          config.onFail(zaposleni, e);
          throw e;
        }
      }

      this._mailSender.closeConnections();
    } catch (e) {
      this._mailSender.closeConnections();
      throw e;
    }
  }

  private async _posaljiEmailZaposlenom(zaposleni: DbEmployeeWithPages) {
    let mail = await this._kreirajMailObjekat(zaposleni);
    console.log('sending...');
    await this._mailSender.sendAsync(mail);
    console.log('sent');
  }

  private async _kreirajPdfFajlSaRelevantimStranicama(
    zaposleni: DbEmployeeWithPages,
    file: PDFDocument
  ): Promise<Uint8Array> {
    let pdfDoc = await PDFDocument.create();

    for (let i = 0; i < zaposleni.pageNumbers.length; i++) {
      let [page] = await pdfDoc.copyPages(file, [zaposleni.pageNumbers[i] - 1]);
      pdfDoc.addPage(page);
    }

    return await pdfDoc.save();
  }

  private async _kreirajMailObjekat(
    zaposleni: DbEmployeeWithPages
  ): Promise<any> {
    let pdfBytes = await this._kreirajPdfFajlSaRelevantimStranicama(
      zaposleni,
      this._izvorniPdfFajl
    );
    return {
      from: this._user,
      to: `${zaposleni.dbEmployee.email1 ?? ''},${zaposleni.dbEmployee.email2 ??
        ''}`,
      subject: this._subject,
      text: '',
      html:
        '<span>Ovaj mail je dostavljen putem aplikacije Računovođa.</span><br/><b>www.bogmilko.rs</b>',
      attachments: [
        {
          filename: this._subject + '.pdf',
          content: pdfBytes
        }
      ]
    };
  }
}
const API_URL = `${BASE_URL}/api/slanjeMailova`;

export async function logSendingMail(props: {
  uspesno: boolean;
  subject: string;
  vrsta: string;
  naziv_skole_iz_fajla: string;
  greska?: string;
}) {
  await axios.post(`${API_URL}/log`, { ...props });
}
