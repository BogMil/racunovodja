export type Employee = {
  id: number;
  active: boolean;
  jmbg: string;
  number: string;
  last_name: string;
  first_name: string;
  banc_account: string;
  municipality: Municipality;
  default_relations: DefaultRelation[];
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
