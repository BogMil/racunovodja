import { Opstina } from '../zaposleni/zaposleni.types';

export type UserDetails = {
  id: number;
  poreski_identifikacioni_broj: string;
  maticni_broj: string;
  id_opstine: number | '';
  municipality: Opstina;
  telefon: string;
  ulica_i_broj: string;
  email_za_slanje: string;
  password_email_za_slanje: string;
  naziv_skole: string;
  bankovni_racun: string;
  mesto: string;
  tip_skole: number | '';
  sifra_skole: string;
};

export const getInitialUserDetails = () => {
  return {
    id: 0,
    poreski_identifikacioni_broj: '',
    maticni_broj: '',
    id_opstine: '',
    municipality: {},
    telefon: '',
    ulica_i_broj: '',
    email_za_slanje: '',
    naziv_skole: '',
    bankovni_racun: '',
    password_email_za_slanje: '',
    mesto: '',
    tip_skole: '',
    sifra_skole: ''
  } as UserDetails;
};
