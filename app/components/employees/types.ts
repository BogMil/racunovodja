import { Relation } from '../sifarnici/relations/relations.types';

export type Employee = {
  id: number;
  active: boolean;
  jmbg: string;
  number: string;
  last_name: string;
  first_name: string;
  banc_account: string;
  municipality: Municipality;
  default_relations: Relation[];
  email: string;
};

export type EmployeeCDTO = {
  id: number;
  active: boolean;
  jmbg: string;
  number: string;
  last_name: string;
  first_name: string;
  banc_account: string;
  municipality_id: number;
  email: string;
};

export const newEmployeeCDTO = () => {
  return {
    jmbg: '',
    number: '',
    last_name: '',
    first_name: '',
    banc_account: '',
    municipality_id: 1,
    email: '',
    active: true
  } as EmployeeCDTO;
};

export type Municipality = {
  id: number;
  code: string;
  name: string;
};

export type DefaultRelation = {
  id: number;
  name: string;
};
