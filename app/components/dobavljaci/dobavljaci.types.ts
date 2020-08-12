export type Dobavljac = {
  id: number;
  naziv: string;
  user_id: number;
  adresa: string;
  pib: string;
  ziro_racun: string;
};

export type DobavljacCDTO = {
  id: number;
  naziv: string;
  user_id: number;
  adresa: string;
  pib: string;
  ziro_racun: string;
};

export const newDobavljacCDTO = () => {
  return {
    naziv: '',
    id: -1,
    user_id: -1,
    adresa: '',
    pib: '',
    ziro_racun: ''
  } as DobavljacCDTO;
};
