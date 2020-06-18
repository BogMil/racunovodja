import { Municipality } from '../employees/types';

export type UserDetails = {
  id: number;
  poreski_identifikacioni_broj: string;
  maticni_broj: string;
  opstina_id: number;
  municipality: Municipality;
  telefon: string;
  ulica_i_broj: string;
  email: string;
  naziv_skole: string;
};

export const getInitialUserDetails = () => {
  return {
    id: 0,
    poreski_identifikacioni_broj: '',
    maticni_broj: '',
    opstina_id: 1,
    municipality: {},
    telefon: '',
    ulica_i_broj: '',
    email: '',
    naziv_skole: ''
  } as UserDetails;
};
