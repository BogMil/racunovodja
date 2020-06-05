import React from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Employee } from '../travelingExpenseModal.types';
import { checkEmployee } from '../travelingExpenseModal.actions';

type Props = {
  employee: Employee;
};
export default function EmployeeComponent(props: Props) {
  let { employee } = props;
  const dispatch = useDispatch();

  const onCheckEmployee = () => {
    dispatch(checkEmployee(employee.id));
  };

  return (
    <tr key={employee.jmbg}>
      <td style={{ textAlign: 'center' }}>
        <Form.Check
          type="checkbox"
          label=""
          checked={employee.checked}
          onChange={onCheckEmployee}
        />
      </td>
      <td>{employee.jmbg}</td>
      <td>{employee.number}</td>
      <td>{employee.last_name}</td>
      <td>{employee.first_name}</td>
    </tr>
  );
}
