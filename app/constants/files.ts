const remote = require('electron').remote;
const app = remote.app;
var fs = require('fs');

export const ROOT_DIR = 'Računovođa';
export const DODATNI_PRIHODI_DIR = 'Dodatni prihodi iz radnog odnosa';
export const PUTNI_TROSKOVI_DIR = 'Obračuni putnih troškova';
export const IZVESTAJI_SLANJA_MAILOVA_DIR = 'Izveštaji slanja mailova';
export const PUTNI_TROSKOVI_PPP_PD_XML_FILE = (year: number, month: number) =>
  `putni-troškovi-${year}-${month}-PPP-PD.xml`;

export const PUTNI_TROSKOVI_PDF_FILE = (year: number, month: number) =>
  `putni-troškovi-${year}-${month}.pdf`;

export const NALOZI_ZA_PRENOS_PDF_FILE = (year: number, month: number) =>
  `putni-troškovi-nalozi-za-prenos-${year}-${month}.pdf`;

export const CREATE_MODE = 'CREATE_MODE';

export const GET_PUTNI_TROSKOVI_PPP_PD_FILE = (year: number, month: number) =>
  `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${PUTNI_TROSKOVI_PPP_PD_XML_FILE(
    year,
    month
  )}`;

export const GET_PUTNI_TROSKOVI_PPP_PD_DIR = (year: number, month: number) =>
  `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`;

export const DPL_DB_FILE = () => {
  const appDataPath = app.getPath('appData').replace('\\Roaming', '');
  return `${appDataPath}\\Local\\Dostavljač platnih listića\\databaseV2.db`;
};
export const mk_YEAR_AND_MONTH_DIR = (year: number, month: number) => {
  if (!fs.existsSync(`C:\\${ROOT_DIR}`)) fs.mkdir(`C:\\${ROOT_DIR}`, () => {});

  if (!fs.existsSync(`C:\\${ROOT_DIR}\\${year}`))
    fs.mkdir(`C:\\${ROOT_DIR}\\${year}`, () => {});

  if (!fs.existsSync(`C:\\${ROOT_DIR}\\${year}\\${month}`))
    fs.mkdir(`C:\\${ROOT_DIR}\\${year}\\${month}`, () => {});
};

export const mk_PUTNI_TROSKOVI_DIR = (year: number, month: number) => {
  mk_YEAR_AND_MONTH_DIR(year, month);

  if (
    !fs.existsSync(`C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}`)
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}`,
      () => {}
    );

  if (
    !fs.existsSync(
      `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\`
    )
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`,
      () => {}
    );

  return `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`;
};

export const mk_IZVESTAJI_SLANJA_MAILOVA_DIR = (year: string) => {
  if (!fs.existsSync(`C:\\${ROOT_DIR}`)) fs.mkdir(`C:\\${ROOT_DIR}`, () => {});

  if (!fs.existsSync(`C:\\${ROOT_DIR}\\${year}`))
    fs.mkdir(`C:\\${ROOT_DIR}\\${year}`, () => {});

  if (
    !fs.existsSync(`C:\\${ROOT_DIR}\\${year}\\${IZVESTAJI_SLANJA_MAILOVA_DIR}`)
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${IZVESTAJI_SLANJA_MAILOVA_DIR}`,
      () => {}
    );

  return `C:\\${ROOT_DIR}\\${year}\\${IZVESTAJI_SLANJA_MAILOVA_DIR}`;
};

export const get_IZVESTAJI_SLANJA_MAILOVA_DIR = (year: string) =>
  `C:\\${ROOT_DIR}\\${year}\\${IZVESTAJI_SLANJA_MAILOVA_DIR}`;
