export class NepredvidjenException extends Error {
  originalException: any;
  constructor(originalException: Error) {
    super(
      'Nepredvidjena greska prilikom inicijalizacije modula za slanje mail-ova.\n' +
        originalException.message
    );
    this.originalException = originalException;
  }
}
