import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays
} from '../../../../travelingExpenses.types';
import DeleteRowButton from '../../../../../common/rowButtons/deleteRowButton';
import { useDispatch } from 'react-redux';
import { open } from '../editDaysModal/editDaysModal.actions';
import { handleResponse } from '../../../../../../utils/responseHandler';
import * as service from '../../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { areYouSure } from '../../../../../../utils/yesNoModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute } from '@fortawesome/free-solid-svg-icons';
import { columnWidths, innerTableWidth } from '../../details.columnWidths';

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

  const onRemoveRelation = async (relationWithDaysId: number) => {
    areYouSure({
      onYes: onYes,
      title: 'Brisanje relacije'
    });
    async function onYes() {
      handleResponse(await service.removeRelation(relationWithDaysId), () => {
        dispatch(
          reloadTravelingExpenseDetails(
            props.employeeWithRelation.traveling_expense_id
          )
        );
      });
    }
  };

  return (
    <tr style={{ borderBottom: '2px solid #3f0e40' }}>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.jmbg}
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        <div style={{ display: 'inline-block' }}>
          {props.employeeWithRelation.employee.last_name}{' '}
          {props.employeeWithRelation.employee.first_name}
        </div>
        <div style={{ display: 'inline-block', float: 'right' }}>
          <Button
            style={{ padding: 0, paddingLeft: 3, paddingRight: 3 }}
            variant="success"
            title="Dodaj novu relaciju"
          >
            <FontAwesomeIcon icon={faRoute} />{' '}
          </Button>
        </div>
      </td>
      <td style={{ padding: 0 }} colSpan={4}>
        <Table style={{ marginBottom: 0 ,width:innerTableWidth}}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td style={{width:columnWidths.relationName}}>
                      <div style={{ display: 'inline-block' }}>
                        {relationWithDays.relation.name}
                      </div>
                      <div style={{ display: 'inline-block', float: 'right' }}>
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
                    <td style={{ textAlign: 'right',width:columnWidths.relationPrice }}>
                      {relationWithDays.relation.price}
                    </td>
                    <td
                      style={{ textAlign: 'center',width:columnWidths.days }}
                      onDoubleClick={() => onDoubleClick(relationWithDays)}
                    >
                      {relationWithDays.days}
                    </td>
                    <td style={{ textAlign: 'right',  backgroundColor: '#ec8989' ,width:columnWidths.sumPerEmployee}}>
                      {relationWithDays.relation.price * relationWithDays.days}
                    </td>

                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>

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
                              <td key={i} style={{ textAlign: 'right',width:columnWidths.nonTaxablePrice }}>{neoporezivo}</td>
                          );
                        }
                      )}
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
                                <td key={i} style={{ textAlign: 'right',width:columnWidths.taxablePrice }}>{oporezivo}</td>
                            );
                          }
                        )}
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
