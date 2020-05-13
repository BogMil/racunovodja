import React from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { Employee } from '../../models/employee';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  employee: Employee;
};

export default function EmployeeComponent(props: Props) {
  let employee = props.employee;
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
      <td style={{ verticalAlign: 'middle' }}>{employee.employeeNumber}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.lastName}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.firstName}</td>
      <td style={{ verticalAlign: 'middle' }}>{employee.bancAccount}</td>
      <td style={{ width: 200, verticalAlign: 'middle' }}>
        {employee.municipality.name}
      </td>
      <td style={{ width: 300, verticalAlign: 'middle' }}>
        <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
          <tbody>
            {employee.defaultRelations.map((defaultRelation, i) => (
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
                    >
                      <FontAwesomeIcon icon={faTimes} />{' '}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td style={{ padding: 0 }}>
                <Button style={{ width: '100%', padding: 0 }}>+</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </td>
    </tr>
  );
}
