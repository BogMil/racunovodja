import { promisify } from 'util';
import { MailAuthException } from './exceptions/mailAuthException';
import { NepredvidjenException } from './exceptions/nepredvidjenException';

const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const MailComposer = require('nodemailer/lib/mail-composer');

export class MailSender {
  private _transporter: any;
  private _sendMail: any;
  private _connection: any;
  private _putIntoSentBox: any;

  public async initAsync(user: string, pass: string) {
    try {
      this._transporter = this._createTransporter(user, pass);
      this._sendMail = promisify(this._transporter.sendMail).bind(
        this._transporter
      );

      var config = this._createImapConfig(user, pass);
      this._connection = await imaps.connect(config);
      this._putIntoSentBox = promisify(this._connection.append).bind(
        this._connection
      );
    } catch (e) {
      if (e.textCode && e.textCode == 'AUTHENTICATIONFAILED') {
        throw new MailAuthException();
      }
      throw new NepredvidjenException(e);
    }
  }

  public closeConnections() {
    this._connection?.end();
    this._transporter?.close();
  }

  private _createTransporter(user: string, pass: string) {
    return nodemailer.createTransport({
      host: 'mail.bogmilko.rs',
      port: 465,
      secure: true,
      auth: {
        user,
        pass
      }
    });
  }

  private _createImapConfig(user: string, pass: string) {
    return {
      imap: {
        user,
        password: pass,
        host: 'mail.bogmilko.rs',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
      }
    };
  }

  public async sendAsync(mailObject: any): Promise<void> {
    let info = await this._sendMail(mailObject);
    if (!info) {
      console.log(info);
    }
    var mail = new MailComposer(mailObject);
    let compiledMail = mail.compile();
    let buildMail = promisify(compiledMail.build).bind(compiledMail);
    let message = await buildMail();
    let res = await this._putIntoSentBox(message, {
      mailbox: 'INBOX.Sent',
      flags: '\\Seen'
    });
    console.log(res);
  }
}
