const remote = require('electron').remote;
const app = remote.app;

export const ROOT_DIR = 'Računovođa';
export const DODATNI_PRIHODI_DIR = 'Dodatni prihodi iz radnog odnosa';
export const PUTNI_TROSKOVI_DIR = 'Obračuni putnih troškova';
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
