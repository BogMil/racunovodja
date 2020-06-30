export const ROOT_DIR = 'Računovođa';
export const DODATNI_PRIHODI_DIR = 'Dodatni prihodi iz radnog odnosa';
export const PUTNI_TROSKOVI_DIR = 'Obračuni putnih troškova';
export const PUTNI_TROSKOVI_PPP_PD_XML_FILE = (year: number, month: number) =>
  `putni-troškovi-${year}-${month}-PPP-PD.xml`;

export const PUTNI_TROSKOVI_PDF_FILE = (year: number, month: number) =>
  `putni-troškovi-${year}-${month}.pdf`;

export const VIRMANI_PDF_FILE = (year: number, month: number) =>
  `putni-troškovi-virmani-${year}-${month}.pdf`;

export const CREATE_MODE = 'CREATE_MODE';

export const GET_PUTNI_TROSKOVI_PPP_PD_FILE = (year: number, month: number) =>
  `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${PUTNI_TROSKOVI_PPP_PD_XML_FILE(
    year,
    month
  )}`;

export const GET_PUTNI_TROSKOVI_PPP_PD_DIR = (year: number, month: number) =>
  `C:\\${ROOT_DIR}\\${year}\\${month}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`;
