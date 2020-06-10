import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays
} from '../../../../travelingExpenses.types';
import DeleteRowButton from '../../../../../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../../../../../utils/yesNoModal';
import { handleResponse } from '../../../../../../utils/responseHandler';
import { useDispatch } from 'react-redux';
import * as service from '../../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { open } from '../addRelationWithDaysModal/addRelationWithDaysModal.actions';
import {columnWidths, innerTableWidth} from '../../details.columnWidths'
import { open as openEditDaysModal } from '../editDaysModal/editDaysModal.actions';

type Props = {
  employeeWithRelations: EmployeeWithRelations;
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
          props.employeeWithRelations.id
        ),
        () => {
          dispatch(
            reloadTravelingExpenseDetails(
              props.employeeWithRelations.traveling_expense_id
            )
          );
        }
      );
    }
  };

  const onRemoveRelation = async (relationWithDaysId: number) => {
    areYouSure({
      onYes: onYes,
      title: 'Brisanje relacije'
    });
    async function onYes() {
      handleResponse(await service.removeRelation(relationWithDaysId), () => {
        dispatch(
          reloadTravelingExpenseDetails(
            props.employeeWithRelations.traveling_expense_id
          )
        );
      });
    }
  };

  const onAddRelationWithDays = () => {
    dispatch(open(props.employeeWithRelations.id));
  };

  function onDoubleClick(relationWithDays: RelationWithDays) {
    dispatch(openEditDaysModal(relationWithDays, props.employeeWithRelations.employee));
  }

  let sum = 0;
  for (let relationsWithDays of props.employeeWithRelations.relations_with_days) {
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
          {props.employeeWithRelations.employee.jmbg}
        </td>
        <td
          rowSpan={2}
          style={{ borderBottom: '2px solid #3f0e40', verticalAlign: 'middle',width:columnWidths.fullName }}
        >
          <div style={{ display: 'inline-block' }}>
            {props.employeeWithRelations.employee.last_name}{' '}
            {props.employeeWithRelations.employee.first_name}
          </div>
          <div style={{ display: 'inline-block', float: 'right' }}>
            <Button
              onClick={() => onAddRelationWithDays()}
              style={{ padding: 0, paddingLeft: 3, paddingRight: 3 }}
              variant="success"
              title="Dodaj novu relaciju"
            >
              <FontAwesomeIcon icon={faRoute} />{' '}
            </Button>
          </div>
        </td>
        <td style={{ padding: 0 }} colSpan={4}>
          <Table style={{ marginBottom: 0,width:innerTableWidth }} >
            <tbody>
              {props.employeeWithRelations.relations_with_days &&
                props.employeeWithRelations.relations_with_days.map(
                  (relationWithDays: RelationWithDays, i) => (
                    <tr key={i}>
                      <td style={{width:columnWidths.relationName}}>
                        <div style={{ display: 'inline-block' }}>
                          {relationWithDays.relation.name}
                        </div>
                        <div
                          style={{ display: 'inline-block', float: 'right' }}
                        >
                          <a
                            style={{ color: 'red' }}
                            title="Ukloni relaciju"
                            onClick={() => {
                              onRemoveRelation(relationWithDays.id);
                            }}
                          >
                            <b>x</b>
                          </a>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' ,width:columnWidths.relationPrice}}>
                        {relationWithDays.relation.price}
                      </td>
                      <td style={{ textAlign: 'center',width:columnWidths.days }}
                      onDoubleClick={() => onDoubleClick(relationWithDays)}
                      >
                        {relationWithDays.days}
                      </td>
                      <td style={{ textAlign: 'right',  backgroundColor: '#f6d674' ,width:columnWidths.sumPerEmployee}}>
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
        <td style={{ textAlign: 'right', backgroundColor: '#ec8989',width:columnWidths.sumPerEmployee }}>
          {sum}
        </td>
        <td style={{ textAlign: 'right',width:columnWidths.nonTaxablePrice }}>{neoporezivo}</td>
        <td style={{ textAlign: 'right',width:columnWidths.taxablePrice }}>{oporezivo}</td>
      </tr>
    </>
  );
}
