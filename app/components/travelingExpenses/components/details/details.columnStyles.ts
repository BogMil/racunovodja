export const columnWidths = {
  relationName: 300,
  relationPrice: 70,
  days: 60,
  sumPerEmployee: 100,
  taxablePrice: 100,
  nonTaxablePrice: 100,
  brutoTaxable: 100,
  fullName: 300,
  jmbg: 150,
  actions: 50,
  tax: 100,

  sum(): number {
    let props = Object.getOwnPropertyNames(this).filter(prop => prop != 'sum');
    let sum = 0;
    for (let prop of props) {
      let value = this[prop];
      sum += value;
    }

    return sum;
  }
};

export const innerTableWidth =
  columnWidths.relationName +
  columnWidths.relationPrice +
  columnWidths.days +
  columnWidths.sumPerEmployee;

export const columColors = {
  sumPerEmployee: '#BAC6E5',
  taxablePrice: '#f9dfda',
  nonTaxablePrice: '#DEEBE1',
  brutoTaxable: '#f2b8ae',
  tax: '#e77e6c'
};
