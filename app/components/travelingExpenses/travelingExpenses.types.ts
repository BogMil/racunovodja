import { Employee } from '../employees/types';
import { Relation } from '../relations/relations.types';

export type TravelingExpense = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
};

export type TravelingExpenseCDTO = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
};

export const newTravelingExpenseCDTO = () => {
  let now = new Date(Date.now());

  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  return {
    id: 0,
    year: year,
    month: month,
    creation_date: ''
  } as TravelingExpenseCDTO;
};

export type TravelingExpenseWithDetails = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
  employees_with_relation: EmployeeWithRelations[];
};

export type EmployeeWithRelations = {
  id: number;
  employee_id: number;
  traveling_expense_id: number;
  employee: Employee;
  relations_with_days: RelationWithDays[];
};

export type RelationWithDays = {
  days: 0;
  id: 5;
  relation_id: 1;
  traveling_expense_employee_id: 15;
  relation: Relation;
};
