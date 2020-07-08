import { Employee } from '../../types';

export type EmployeeFromDPL = {
  JMBG: string;
  EmployeeNumber: string;
  Email: string;
};

export type EmployeeToSyncEmail = {
  dplEmployee: EmployeeFromDPL;
  dbEmployee: Employee;
};
