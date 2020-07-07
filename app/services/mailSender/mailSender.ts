import { promisify } from 'util';

const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const MailComposer = require('nodemailer/lib/mail-composer');
const util = require('util');

export class MailSender {
  private _transporter: any;
  private _sendMail: any;
  private _connection: any;

  public async init(user: string, pass: string) {
    try {
      this._transporter = this._createTransporter(user, pass);
      this._sendMail = promisify(this._transporter.sendMail).bind(
        this._transporter
      );

      var config = this._createImapConfig(user, pass);
      this._connection = await imaps.connect(config);
    } catch (e) {
      console.log(e);
    }
  }

  public closeConnections() {
    this._connection.end();
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

  public async send(
    user: string,
    pass: string,
    mailObject: any
  ): Promise<void> {
    let info = await this._sendMail(mailObject);
    if (!info) {
      console.log(info);
    }
    var mail = new MailComposer(mailObject);
    let compiledMail = mail.compile();
    let buildMail = promisify(compiledMail.build).bind(compiledMail);
    let message = await buildMail();
    let putIntoSentBox = promisify(this._connection.append).bind(
      this._connection
    );
    let res = await putIntoSentBox(message, {
      mailbox: 'INBOX.Sent',
      flags: '\\Seen'
    });
    console.log(res);
  }
}
