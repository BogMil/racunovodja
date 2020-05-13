import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import * as service from './employeeService';
import EmployeeComponent from './components/employee/employee';
import { Employee } from './models/employee';
import AddDefaultRealtionModal from './components/addDefaultRelationModal/addDefaultRelationModal';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    let employees = service.get();
    setEmployees(employees);
  }, []);

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Aktivan</th>
            <th>JMBG</th>
            <th>Broj zaposlenog</th>
            <th>Prezime</th>
            <th>Ime</th>
            <th>Broj računa</th>
            <th>Opština stanovanja</th>
            <th>Podrazumevana relacija</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <EmployeeComponent key={index} employee={employee} />
          ))}
        </tbody>
      </Table>
      <AddDefaultRealtionModal />
    </>
  );
}
