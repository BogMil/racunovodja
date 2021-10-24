import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { MailSender } from '../../services/mailSender/mailSender';
import axios from 'axios';
import { BASE_URL } from '../../config';
const fs = require('fs');

export class SlanjeMailovaServiceV2 {
  private _subject: string;
  private _filePath: string;
  private _mailSender: MailSender;
  private _user: string;
  private _pass: string;

  constructor(config: { filePath: string; user: string; pass: string }) {
    this._mailSender = new MailSender();
    this._filePath = config.filePath;
    this._user = config.user;
    this._pass = config.pass;
  }

  private async _initAsync() {
    this._subject = await new PdfDataExtractor().subjectAsync(this._filePath);
    await this._mailSender.initAsync(this._user, this._pass);
  }

  public async posaljiEmailoveZaposlenima(config: {
    listaZaposlenih: any[];
    onSuccess: (zaposleni: any) => Promise<void>;
    onFail: (zaposleni: any, e: any) => Promise<void>;
  }) {
    try {
      await this._initAsync();
      for (let zaposleni of config.listaZaposlenih) {
        try {
          await this._posaljiEmailZaposlenom(zaposleni);
          await config.onSuccess(zaposleni);
        } catch (e) {
          await config.onFail(zaposleni, e);
          throw e;
        }
      }

      this._mailSender.closeConnections();
    } catch (e) {
      this._mailSender.closeConnections();
      throw e;
    }
  }

  private async _posaljiEmailZaposlenom(zaposleni: any) {
    let mail = await this._kreirajMailObjekat(zaposleni);
    console.log(mail);
    console.log('sending...');
    await this._mailSender.sendAsync(mail);
    console.log('sent');
  }

  private async _kreirajMailObjekat(zaposleni: any): Promise<any> {
    return {
      from: this._user,
      to: `${zaposleni.email1 ?? ''},${zaposleni.email2 ?? ''}`,
      subject: this._subject,
      text: '',
      html:
        '<span>Ovaj mail je dostavljen putem aplikacije Računovođa.</span><br/><b>www.bogmilko.rs</b>',
      attachments: [
        {
          filename: this._subject + '.pdf',
          path: zaposleni.fajl,
          contentType: 'application/pdf'
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
  rezultat_slanja: string;
}) {
  await axios.post(`${API_URL}/log`, { ...props });
}
