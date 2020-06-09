import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays
} from '../../../travelingExpenses.types';
import DeleteRowButton from '../../../../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../../../../utils/yesNoModal';
import { handleResponse } from '../../../../../utils/responseHandler';
import { useDispatch } from 'react-redux';
import * as service from '../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../details.actions';

type Props = {
  employeeWithRelation: EmployeeWithRelations;
};

export default function MultipleRelationsTemplate(props: Props) {
  const dispatch = useDispatch();
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

  let sum = 0;
  for (let relationsWithDays of props.employeeWithRelation
    .relations_with_days) {
    sum += relationsWithDays.days * relationsWithDays.relation.price;
  }
  let oporezivo;
  let neoporezivDeo = 3878.0;

  if (sum <= neoporezivDeo) oporezivo = 0;
  else oporezivo = sum - neoporezivDeo;

  let neoporezivo = sum - oporezivo;
  return (
    <>
      <tr>
        <td
          rowSpan={2}
          style={{ borderBottom: '2px solid #3f0e40', verticalAlign: 'middle' }}
        >
          {props.employeeWithRelation.employee.jmbg}
        </td>
        <td
          rowSpan={2}
          style={{ borderBottom: '2px solid #3f0e40', verticalAlign: 'middle' }}
        >
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
                        <div
                          style={{ display: 'inline-block', float: 'right' }}
                        >
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
                      <td style={{ textAlign: 'center' }}>
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
            <tbody style={{ backgroundColor: '#f6d674' }}>
              {props.employeeWithRelation.relations_with_days &&
                props.employeeWithRelation.relations_with_days.map(
                  (relationWithDays: RelationWithDays, i) => (
                    <tr key={i}>
                      <td style={{ textAlign: 'right' }}>
                        {relationWithDays.relation.price *
                          relationWithDays.days}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </td>
        <td colSpan={2}></td>
        <td
          rowSpan={2}
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
      <tr style={{ borderBottom: '2px solid #3f0e40' }}>
        <td colSpan={3}></td>
        <td style={{ textAlign: 'right', backgroundColor: '#ec8989' }}>
          {sum}
        </td>
        <td style={{ textAlign: 'right' }}>{neoporezivo}</td>
        <td style={{ textAlign: 'right' }}>{oporezivo}</td>
      </tr>
    </>
  );
}
