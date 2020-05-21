import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import EmployeeComponent from './components/employee/employee';
import AddDefaultRealtionModal from './components/addDefaultRelationModal/addDefaultRelationModal';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmployees } from './employees.actions';
import { AppStore } from '../../reducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileUpload } from '@fortawesome/free-solid-svg-icons';

export default function Employees() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.employees;
  });

  useEffect(() => {
    dispatch(loadEmployees());
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
            <th style={{ textAlign: 'center' }}>
              <Button
                title="Kreiraj novog zaposlenog"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginRight: 5
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
              <Button
                title="Učitaj zaposlene iz platnih listića"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0
                }}
              >
                <FontAwesomeIcon icon={faFileUpload} />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {store.employees &&
            store.employees.map((employee, index) => (
              <EmployeeComponent key={index} employee={employee} />
            ))}
        </tbody>
      </Table>
      <AddDefaultRealtionModal />
    </>
  );
}
