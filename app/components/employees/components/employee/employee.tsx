import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { Employee } from '../../types';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import * as AddDefaultRelationModalActions from '../addDefaultRelationModal/addDefaultRelationModal.actions';
import { removeRelationFromEmployee } from '../../employees.actions';

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
    <tr>
      <td
        style={{
          verticalAlign: 'middle',
          textAlign: 'center'
        }}
      >
        <Form.Check type="checkbox" label="" checked={employee.active} />
      </td>
      <td style={{ verticalAlign: 'middle' }}>{employee.jmbg}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.number}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.last_name}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.first_name}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.banc_account}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.municipality.name}</td>
      <td style={{ verticalAlign: 'middle' }}>
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
                  style={{ width: '100%', padding: 0 }}
                >
                  +
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </td>
      <td>actions</td>
    </tr>
  );
}
