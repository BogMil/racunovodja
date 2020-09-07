import { DPL_DB_FILE } from '../../constants/files';
const fs = require('fs');

const postojiDostavljacPlatnihListica = fs.existsSync(DPL_DB_FILE());

export const columnWidths = {
  // activan: 70,
  jmbg: 130,
  broj: 100,
  prezime: 200,
  ime: 100,
  brojRacuna: 200,
  opstina: 150,
  relacije: 300,
  email: 300,
  actions: postojiDostavljacPlatnihListica ? 110 : 70,

  sum(): number {
    let props = Object.getOwnPropertyNames(this).filter(prop => prop != 'sum');
    let sum = 0;
    for (let prop of props) {
      let value = (this as any)[prop];
      sum += value;
    }
    console.log(sum);
    return sum;
  }
};
