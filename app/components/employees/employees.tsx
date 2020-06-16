import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import EmployeeComponent from './components/employee/employee';
import AddDefaultRealtionModal from './components/addDefaultRelationModal/addDefaultRelationModal';
import EmployeeModal from './components/employeeModal/employeeModal';
import { useDispatch, useSelector } from 'react-redux';
import { loadEmployees } from './employees.actions';
import { AppStore } from '../../reducers';
import { openCreate } from './components/employeeModal/employeeModal.actions';
import UploadFileModal from './components/uploadFileModal/uploadFileModal';
import { open } from './components/uploadFileModal/uploadFileModal.actions';

export default function Employees() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.employees;
  });

  useEffect(() => {
    dispatch(loadEmployees());
  }, []);

  const openCreateDialog = () => {
    dispatch(openCreate());
  };

  const openUploadDialog = () => {
    dispatch(open());
  };

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
                onClick={openCreateDialog}
                title="Kreiraj novog zaposlenog"
                variant="success"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginRight: 5
                }}
              >
                <i className="fa fa-plus" />
              </Button>
              <Button
                title="Učitaj zaposlene iz platnih listića"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0
                }}
                onClick={openUploadDialog}
              >
                <i className="fa fa-file-upload" />
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
      <EmployeeModal />
      <UploadFileModal />
    </>
  );
}
