import { Zaposleni } from '../../zaposleni.types';

export type EmployeeFromDPL = {
  JMBG: string;
  EmployeeNumber: string;
  Email: string;
};

export type EmployeeToSyncEmail = {
  dplEmployee: EmployeeFromDPL;
  dbEmployee: Zaposleni;
};
