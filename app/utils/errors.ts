export default class ErrorsBase {
  public hasAny: Function = (): boolean => {
    let props = Object.getOwnPropertyNames(this).filter(
      prop => prop != 'hasAny'
    );
    for (let prop of props) {
      let value = this[prop];
      if (value != null) return true;
    }

    return false;
  };
}
