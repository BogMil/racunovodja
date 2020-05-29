export class InvalidFileException extends Error {
  constructor() {
    super('Nije validan file');
  }
}
