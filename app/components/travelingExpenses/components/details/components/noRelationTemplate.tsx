import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { EmployeeWithRelations } from '../../../travelingExpenses.types';
import DeleteRowButton from '../../../../common/rowButtons/deleteRowButton';

type Props = {
  employeeWithRelation: EmployeeWithRelations;
};

export default function NoRelationTemplate(props: Props) {
  return (
    <tr style={{ borderBottom: '2px solid #3f0e40' }}>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.jmbg}
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.last_name}{' '}
        {props.employeeWithRelation.employee.first_name}
      </td>
      <td colSpan={6} style={{ padding: 0, verticalAlign: 'middle' }}>
        <Button
          style={{ width: 100, padding: 0 }}
          variant="success"
          title="Dodaj novu relaciju"
        >
          <FontAwesomeIcon icon={faRoute} />{' '}
        </Button>
      </td>
      <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
        <DeleteRowButton
          onClick={() => {}}
          title="Ukloni zaposlenog iz obračuna"
        />
      </td>
    </tr>
  );
}
