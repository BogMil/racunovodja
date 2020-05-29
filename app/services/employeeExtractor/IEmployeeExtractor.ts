import { Employee } from './employeeExtractor.types';

export interface IEmployeeExtractor {
  extract(lines: string[]): Employee;
}
