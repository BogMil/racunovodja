import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { Employee } from '../../types';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import * as AddDefaultRelationModalActions from '../addDefaultRelationModal/addDefaultRelationModal.actions';
import { removeRelationFromEmployee } from '../../employees.actions';
import styles from './employee.css';

type Props = {
  employee: Employee;
};

export default function EmployeeComponent(props: Props) {
  const dispatch = useDispatch();
  let employee = props.employee;

  const onAddDefaultRelationClick = () => {
    dispatch(AddDefaultRelationModalActions.open(employee));
  };

  const removeRelation = (employee: Employee, defaultRelationId: number) => {
    dispatch(removeRelationFromEmployee(employee, defaultRelationId));
  };

  return (
    <tr style={{ backgroundColor: !employee.active ? '#FFD7D7' : '' }}>
      <td
        className={styles.employeeCell}
        style={{
          textAlign: 'center'
        }}
      >
        <Form.Check
          type="checkbox"
          label=""
          disabled
          checked={employee.active}
        />
      </td>
      <td className={styles.employeeCell}>{employee.jmbg}</td>
      <td className={styles.employeeCell}>{employee.number}</td>
      <td className={styles.employeeCell}>{employee.last_name}</td>
      <td className={styles.employeeCell}>{employee.first_name}</td>
      <td className={styles.employeeCell}>{employee.banc_account}</td>
      <td className={styles.employeeCell}>{employee.municipality.name}</td>
      <td className={styles.employeeCell}>
        <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
          <tbody>
            {employee.default_relations.map((defaultRelation, i) => (
              <tr key={i}>
                <td style={{ padding: 0 }}>
                  <div style={{ float: 'left' }}>{defaultRelation.name}</div>
                  <div style={{ float: 'right' }}>
                    <Button
                      variant="danger"
                      style={{
                        paddingTop: 0,
                        paddingLeft: 2,
                        paddingRight: 2,
                        height: 25
                      }}
                      title="Ukloni podrazumevanu relaciju"
                      onClick={() =>
                        removeRelation(employee, defaultRelation.id)
                      }
                    >
                      <FontAwesomeIcon icon={faTimes} />{' '}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: 0 }}>
                <Button
                  onClick={() => onAddDefaultRelationClick()}
                  style={{ width: '100%', padding: 0, height: 25 }}
                >
                  +
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </td>
      <td style={{ textAlign: 'center' }}>
        <Button
          variant="warning"
          title="Ažuriranje zaposlenog"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 5,
            paddingRight: 5,
            marginRight: 5,
            height: 25
          }}
        >
          <FontAwesomeIcon icon={faEdit} />{' '}
        </Button>

        <Button
          variant="danger"
          title="Brisanje zaposlenog"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 5,
            paddingRight: 5,
            height: 25
          }}
        >
          <FontAwesomeIcon icon={faTimes} />{' '}
        </Button>
      </td>
    </tr>
  );
}
