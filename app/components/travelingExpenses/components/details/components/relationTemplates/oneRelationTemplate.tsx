import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays,
  EmployeeTravelingExpenseCalculator
} from '../../../../travelingExpenses.types';
import DeleteRowButton from '../../../../../common/rowButtons/deleteRowButton';
import { useDispatch, useSelector } from 'react-redux';
import { open as openEditDaysModal } from '../editDaysModal/editDaysModal.actions';
import { handleResponse } from '../../../../../../utils/responseHandler';
import * as service from '../../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { areYouSure } from '../../../../../../utils/yesNoModal';
import {
  columnWidths,
  innerTableWidth,
  columColors
} from '../../details.columnStyles';
import { open as openAddRelationWithDaysMoad } from '../addRelationWithDaysModal/addRelationWithDaysModal.actions';
import { AppStore } from '../../../../../../reducers';
import { numberWithThousandSeparator } from '../../../../../../utils/numberWithThousandSeparator';
import { U_RADU } from '../../../../../../constants/statuses';

type Props = {
  employeeWithRelation: EmployeeWithRelations;
};

export default function OneRelationTemplate(props: Props) {
  const dispatch = useDispatch();
  let {
    month,
    year,
    maxNonTaxedValue,
    preracun_na_bruto,
    stopa,
    status
  } = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
    year,
    month,
    maxNonTaxedValue,
    preracun_na_bruto,
    stopa
  );
  let calclulation = employeeTravelingExpenseCalculator.getCalculation(
    props.employeeWithRelation
  );

  function onDoubleClick(relationWithDays: RelationWithDays) {
    if (status == U_RADU.value)
      dispatch(
        openEditDaysModal(relationWithDays, props.employeeWithRelation.employee)
      );
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

  const onAddRelationWithDays = () => {
    dispatch(openAddRelationWithDaysMoad(props.employeeWithRelation.id));
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
        {status == U_RADU.value ? (
          <div style={{ display: 'inline-block', float: 'right' }}>
            <Button
              onClick={() => onAddRelationWithDays()}
              style={{ padding: 0, paddingLeft: 3, paddingRight: 3 }}
              variant="success"
              title="Dodaj novu relaciju"
            >
              <i className="fa fa-route" />
            </Button>
          </div>
        ) : null}
      </td>
      <td style={{ padding: 0 }} colSpan={4}>
        <Table style={{ marginBottom: 0, width: innerTableWidth }}>
          <tbody>
            {props.employeeWithRelation.relations_with_days &&
              props.employeeWithRelation.relations_with_days.map(
                (relationWithDays: RelationWithDays, i) => (
                  <tr key={i}>
                    <td style={{ width: columnWidths.relationName }}>
                      <div style={{ display: 'inline-block' }}>
                        {`${relationWithDays.relation.name} - ${relationWithDays.relation.lokacija.naziv}`}
                      </div>
                      {status == U_RADU.value ? (
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
                      ) : null}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        width: columnWidths.relationPrice
                      }}
                    >
                      {numberWithThousandSeparator(
                        relationWithDays.relation.price
                      )}
                    </td>
                    <td
                      style={{ textAlign: 'center', width: columnWidths.days }}
                      onDoubleClick={() => onDoubleClick(relationWithDays)}
                    >
                      {relationWithDays.days}
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        backgroundColor: columColors.sumPerEmployee,

                        width: columnWidths.sumPerEmployee
                      }}
                    >
                      {numberWithThousandSeparator(calclulation.neto)}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </Table>
      </td>
      <td
        style={{
          textAlign: 'right',
          backgroundColor: columColors.nonTaxablePrice,
          width: columnWidths.nonTaxablePrice
        }}
      >
        {numberWithThousandSeparator(calclulation.neoporezivo)}
      </td>
      <td
        style={{
          textAlign: 'right',
          backgroundColor: columColors.taxablePrice,
          width: columnWidths.taxablePrice
        }}
      >
        {numberWithThousandSeparator(calclulation.oporezivo)}
      </td>

      <td
        style={{
          textAlign: 'right',
          backgroundColor: columColors.brutoTaxable,
          width: columnWidths.brutoTaxable
        }}
      >
        {numberWithThousandSeparator(calclulation.brutoOporezivo)}
      </td>
      <td
        style={{
          textAlign: 'right',
          backgroundColor: columColors.tax,
          width: columnWidths.tax
        }}
      >
        {numberWithThousandSeparator(calclulation.porez)}
      </td>
      {status == U_RADU.value ? (
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
      ) : null}
    </tr>
  );
}
