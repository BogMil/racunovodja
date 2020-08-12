export type Dobavljac = {
  id: number;
  naziv: string;
  user_id: number;
  adresa: string;
  pib: string;
  ziro_racun: string;
  email: string;
  kontakt: string;
};

export type DobavljacCDTO = {
  id: number;
  naziv: string;
  user_id: number;
  adresa: string;
  pib: string;
  ziro_racun: string;
  email: string;
  kontakt: string;
};

export const newDobavljacCDTO = () => {
  return {
    naziv: '',
    id: -1,
    user_id: -1,
    adresa: '',
    pib: '',
    ziro_racun: '',
    email: '',
    kontakt: ''
  } as DobavljacCDTO;
};

export type DetaljiDobavljaca = Dobavljac & {
  id: number;
  naziv: string;
  user_id: number;
  adresa: string;
  pib: string;
  ziro_racun: string;
  email: string;
  kontakt: string;
};

export const detaljiDobavljacaInitial = () => {
  let dobavljac = newDobavljacCDTO();
  return { ...dobavljac };
};
