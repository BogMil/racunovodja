import { Lokacija } from '../lokacije/lokacije.types';

export type Relation = {
  id: number;
  name: string;
  price: number;
  lokacija_id: number;
  lokacija: Lokacija;
  user_id: number;
};

export type RelationCDTO = {
  id: number;
  name: string;
  price: number;
  lokacija_id: number;
};

export const newRelationCDTO = () => {
  return {
    name: '',
    price: 0,
    lokacija_id: 0
  } as RelationCDTO;
};
