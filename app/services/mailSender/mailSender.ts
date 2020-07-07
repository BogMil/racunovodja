const nodemailer = require('nodemailer');
const imaps = require('imap-simple');
const MailComposer = require('nodemailer/lib/mail-composer');
const util = require('util');

export class MailSender {
  private static _createTransporter(user: string, pass: string) {
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

  private static _createImapConfig(user: string, pass: string) {
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

  public static async send(
    user: string,
    pass: string,
    mailObject: any
  ): Promise<void> {
    let transporter = this._createTransporter(user, pass);
    transporter.sendMail(mailObject, async (error: any, info: any) => {
      if (error != null) {
        console.log(error);
      }

      var config = this._createImapConfig(user, pass);
      console.log('config created');

      var mail = new MailComposer(mailObject);
      console.log('mail created');

      imaps.connect(config).then(function(connection: any) {
        mail.compile().build(async function(err: any, message: any) {
          if (err) console.log(err);
          connection.append(
            message,
            {
              mailbox: 'INBOX.Sent',
              flags: '\\Seen'
            },
            e => {
              console.log(e);
            }
          );
        });
      });
    });
  }
}
