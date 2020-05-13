export type Employee = {
  id: number;
  active: boolean;
  jmbg: string;
  employeeNumber: string;
  lastName: string;
  firstName: string;
  bancAccount: string;
  municipality: Municipality;
  defaultRelations: DefaultRelation[];
};

export type Municipality = {
  code: string;
  name: string;
};

export type DefaultRelation = {
  id: number;
  name: string;
};
