import { Relation } from '../sifarnici/relations/relations.types';

export type Zaposleni = {
  id: number;
  aktivan: boolean;
  jmbg: string;
  sifra: string;
  prezime: string;
  ime: string;
  bankovni_racun: string;
  opstina: Opstina;
  default_relations: Relation[];
  email1: string;
  email2: string;
};

export type ZaposleniCDTO = {
  id: number;
  aktivan: boolean;
  jmbg: string;
  sifra: string;
  prezime: string;
  ime: string;
  bankovni_racun: string;
  id_opstine: number | '';
  email1: string;
  email2: string;
};

export const newZaposleniCDTO = () => {
  return {
    jmbg: '',
    sifra: '',
    prezime: '',
    ime: '',
    bankovni_racun: '',
    id_opstine: '',
    email1: '',
    aktivan: true
  } as ZaposleniCDTO;
};

export type Opstina = {
  id: number;
  sifra: string;
  naziv: string;
};

export type DefaultRelation = {
  id: number;
  name: string;
};
