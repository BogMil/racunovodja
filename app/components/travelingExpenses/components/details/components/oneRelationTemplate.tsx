import React from 'react';
import { Table } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays
} from '../../../travelingExpenses.types';
import DeleteRowButton from '../../../../common/rowButtons/deleteRowButton';
import { useDispatch } from 'react-redux';
import { open } from './editDaysModal/editDaysModal.actions';
import { handleResponse } from '../../../../../utils/responseHandler';
import * as service from '../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../details.actions';
import { areYouSure } from '../../../../../utils/yesNoModal';

type Props = {
  employeeWithRelation: EmployeeWithRelations;
};

export default function OneRelationTemplate(props: Props) {
  const dispatch = useDispatch();
  function onDoubleClick(relationWithDays: RelationWithDays) {
    dispatch(open(relationWithDays, props.employeeWithRelation.employee));
  }

  const onRemoveEmployeeFromTravelingExpense = async () => {
    areYouSure({
      onYes: onYes,
      title: 'Brisanje zaposlenog sa svim njegovim relacijama iz obračuna'
    });

    async function onYes() {
      handleResponse(
        await service.removeEmployeeWithRelations(
          props.employeeWithRelation.id
        ),
        () => {
          dispatch(
            reloadTravelingExpenseDetails(
              props.employeeWithRelation.traveling_expense_id
            )
          );
        }
      );
    }
  };

  return (
    <tr style={{ borderBottom: '2px solid #3f0e40' }}>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.jmbg}
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.last_name}{' '}
        {props.employeeWithRelation.employee.first_name}
      </td>
      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'inline-block' }}>
                        {relationWithDays.relation.name}
                      </div>
                      <div style={{ display: 'inline-block', float: 'right' }}>
                        <a style={{ color: 'red' }} title="Ukloni relaciju">
                          <b>x</b>
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>
      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: 'right' }}>
                      {relationWithDays.relation.price}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>
      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td
                      style={{ textAlign: 'center' }}
                      onDoubleClick={() => onDoubleClick(relationWithDays)}
                    >
                      {relationWithDays.days}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>
      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody style={{ backgroundColor: '#ec8989' }}>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td style={{ textAlign: 'right' }}>
                      {relationWithDays.relation.price * relationWithDays.days}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>
      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => {
                  let neoporezivo;
                  let neoporezivDeo = 3878.0;
                  let ukupno =
                    relationWithDays.relation.price * relationWithDays.days;

                  if (ukupno <= neoporezivDeo) neoporezivo = ukupno;
                  else neoporezivo = neoporezivDeo;
                  return (
                    <tr key={i}>
                      <td style={{ textAlign: 'right' }}>{neoporezivo}</td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </Table>
      </td>

      <td style={{ padding: 0 }}>
        <Table style={{ marginBottom: 0 }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => {
                  let oporezivo;
                  let neoporezivDeo = 3878.0;
                  let ukupno =
                    relationWithDays.relation.price * relationWithDays.days;

                  if (ukupno <= neoporezivDeo) oporezivo = 0;
                  else oporezivo = ukupno - neoporezivDeo;
                  return (
                    <tr key={i}>
                      <td style={{ textAlign: 'right' }}>{oporezivo}</td>
                    </tr>
                  );
                }
              )}
          </tbody>
        </Table>
      </td>
      <td
        style={{
          textAlign: 'center',
          verticalAlign: 'middle',
          borderBottom: '2px solid #3f0e40'
        }}
      >
        <DeleteRowButton
          onClick={() => {
            onRemoveEmployeeFromTravelingExpense();
          }}
          title="Ukloni zaposlenog iz obračuna"
        />
      </td>
    </tr>
  );
}
