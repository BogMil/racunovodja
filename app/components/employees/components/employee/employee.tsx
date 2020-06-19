import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Employee, EmployeeCDTO } from '../../types';
import { useDispatch } from 'react-redux';
import * as AddDefaultRelationModalActions from '../addDefaultRelationModal/addDefaultRelationModal.actions';
import {
  removeRelationFromEmployee,
  reloadEmployees
} from '../../employees.actions';
import styles from './employee.css';
import * as Service from '../../employee.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { openEdit } from '../employeeModal/employeeModal.actions';
import DeleteRowButton from '../../../common/rowButtons/deleteRowButton';
import EditRowButton from '../../../common/rowButtons/editRowButton';
import { areYouSure } from '../../../../utils/yesNoModal';
import { columnWidths } from '../../employees.columnStyle';

type Props = {
  employee: Employee;
};

export default function EmployeeComponent(props: Props) {
  const dispatch = useDispatch();
  let employee = props.employee;

  const onAddDefaultRelationClick = () => {
    dispatch(AddDefaultRelationModalActions.open(employee));
  };

  const removeRelation = (defaultRelationId: number) => {
    areYouSure({
      title: 'Brisanje zaposlenog',
      onYes: async () => {
        handleResponse(
          await Service.removeDefaultRelation(employee.id, defaultRelationId),
          () => {
            dispatch(
              removeRelationFromEmployee(employee.id, defaultRelationId)
            );
          }
        );
      }
    });
  };

  const removeEmployee = () => {
    areYouSure({
      title: 'Brisanje zaposlenog',
      onYes: async () => {
        handleResponse(await Service.removeEmployee(employee.id), () => {
          dispatch(reloadEmployees());
        });
      }
    });
  };

  const editEmployee = () => {
    let cdto = (employee as unknown) as EmployeeCDTO;
    cdto.municipality_id = employee.municipality
      ? employee.municipality.id
      : -1;
    dispatch(openEdit(cdto));
  };

  return (
    <tr style={{ backgroundColor: !employee.active ? '#FFD7D7' : '' }}>
      {/* <td
        className={styles.employeeCell}
        style={{
          textAlign: 'center',
          width: columnWidths.activan
        }}
      >
        <Form.Check
          type="checkbox"
          label=""
          disabled
          checked={employee.active}
        />
      </td> */}
      <td style={{ width: columnWidths.jmbg }} className={styles.employeeCell}>
        {employee.jmbg}
      </td>
      <td style={{ width: columnWidths.broj }} className={styles.employeeCell}>
        {employee.number}
      </td>
      <td
        style={{ width: columnWidths.prezime }}
        className={styles.employeeCell}
      >
        {employee.last_name}
      </td>
      <td style={{ width: columnWidths.ime }} className={styles.employeeCell}>
        {employee.first_name}
      </td>
      <td
        style={{ width: columnWidths.brojRacuna }}
        className={styles.employeeCell}
      >
        {employee.banc_account}
      </td>
      <td
        style={{ width: columnWidths.opstina }}
        className={styles.employeeCell}
      >
        {employee.municipality ? employee.municipality.name : '---'}
      </td>
      <td
        className={styles.employeeCell}
        style={{ width: columnWidths.relacije }}
      >
        <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
          <tbody>
            {employee.default_relations.map((defaultRelation, i) => (
              <tr key={i}>
                <td style={{ padding: 0 }}>
                  <div style={{ float: 'left' }}>{defaultRelation.name}</div>
                  <div style={{ float: 'right' }}>
                    <DeleteRowButton
                      title="Ukloni podrazumevanu relaciju"
                      onClick={() => removeRelation(defaultRelation.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: 0 }}>
                <Button
                  variant="success"
                  onClick={() => onAddDefaultRelationClick()}
                  style={{ width: '100%', padding: 0, height: 20 }}
                  title="Dodaj podrazumevanu relaciju"
                >
                  +
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </td>
      <td style={{ width: columnWidths.email }} className={styles.employeeCell}>
        {employee.email}
      </td>

      <td style={{ textAlign: 'center', width: columnWidths.email }}>
        <EditRowButton
          onClick={editEmployee}
          title="Ažuriranje zaposlenog"
          style={{ marginRight: 5 }}
        />

        <DeleteRowButton title="Brisanje zaposlenog" onClick={removeEmployee} />
      </td>
    </tr>
  );
}
