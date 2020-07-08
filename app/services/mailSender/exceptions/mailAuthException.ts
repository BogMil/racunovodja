export class MailAuthException extends Error {
  constructor() {
    super(
      'Greška prilikom prijavljivanja na mail server. Proverite ispravnost lozinke.'
    );
  }
}
