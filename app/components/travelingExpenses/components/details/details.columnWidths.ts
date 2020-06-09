export const columnWidths={
  relationName:300,
  relationPrice:70,
  days:60,
  sumPerEmployee:80,
  taxablePrice:80,
  nonTaxablePrice:80,
  fullName:300,
  jmbg:150,
  actions:50,

  sum(): number {
    let props = Object.getOwnPropertyNames(this).filter(
      prop => prop != 'sum'
    );
    let sum=0;
    for (let prop of props) {
      let value = this[prop];
      sum+=value;
    }

    return sum;
  }
};

export const innerTableWidth=columnWidths.relationName+columnWidths.relationPrice+columnWidths.days+columnWidths.sumPerEmployee;
