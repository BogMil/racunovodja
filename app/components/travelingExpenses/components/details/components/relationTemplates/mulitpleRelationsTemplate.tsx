import React from 'react';
import { Table, Button } from 'react-bootstrap';
import {
  EmployeeWithRelations,
  RelationWithDays,
  EmployeeTravelingExpenseCalculator
} from '../../../../travelingExpenses.types';
import DeleteRowButton from '../../../../../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../../../../../utils/yesNoModal';
import { handleResponse } from '../../../../../../utils/responseHandler';
import { useDispatch, useSelector } from 'react-redux';
import * as service from '../../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { open } from '../addRelationWithDaysModal/addRelationWithDaysModal.actions';
import {
  columnWidths,
  innerTableWidth,
  columColors
} from '../../details.columnStyles';
import { open as openEditDaysModal } from '../editDaysModal/editDaysModal.actions';
import { AppStore } from '../../../../../../reducers';
import { numberWithThousandSeparator } from '../../../../../../utils/numberWithThousandSeparator';
import { U_RADU } from '../../../../../../constants/statuses';

type Props = {
  employeeWithRelations: EmployeeWithRelations;
};

export default function MultipleRelationsTemplate(props: Props) {
  const {
    month,
    year,
    maxNonTaxedValue,
    preracun_na_bruto,
    stopa,
    status
  } = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  let employeeTravelingExpenseCalculator=new EmployeeTravelingExpenseCalculator(year,month,maxNonTaxedValue,preracun_na_bruto,stopa);
  let calculation =employeeTravelingExpenseCalculator.getCalculation(props.employeeWithRelations);

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
    console.log(status);
    if (status == U_RADU.value)
      dispatch(
        openEditDaysModal(
          relationWithDays,
          props.employeeWithRelations.employee
        )
      );
  }

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
          style={{
            borderBottom: '2px solid #3f0e40',
            verticalAlign: 'middle',
            width: columnWidths.fullName
          }}
        >
          <div style={{ display: 'inline-block' }}>
            {props.employeeWithRelations.employee.last_name}{' '}
            {props.employeeWithRelations.employee.first_name}
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
              {props.employeeWithRelations.relations_with_days &&
                props.employeeWithRelations.relations_with_days.map(
                  (relationWithDays: RelationWithDays, i) => (
                    <tr key={i}>
                      <td style={{ width: columnWidths.relationName }}>
                        <div style={{ display: 'inline-block' }}>
                          {relationWithDays.relation.name}
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
                        style={{
                          textAlign: 'center',
                          width: columnWidths.days
                        }}
                        onDoubleClick={() => onDoubleClick(relationWithDays)}
                      >
                        {relationWithDays.days}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          backgroundColor: '#FFF6C9',
                          width: columnWidths.sumPerEmployee
                        }}
                      >
                        {numberWithThousandSeparator(
                          relationWithDays.relation.price *
                            relationWithDays.days
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </td>

        <td colSpan={4}></td>
        {status == U_RADU.value ? (
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
        ) : null}
      </tr>
      <tr style={{ borderBottom: '2px solid #3f0e40' }}>
        <td colSpan={3}></td>
        <td
          style={{
            textAlign: 'right',
            backgroundColor: columColors.sumPerEmployee,
            width: columnWidths.sumPerEmployee
          }}
        >
          {numberWithThousandSeparator(calculation.neto)}
        </td>
        <td
          style={{
            textAlign: 'right',
            backgroundColor: columColors.nonTaxablePrice,
            width: columnWidths.nonTaxablePrice
          }}
        >
          {numberWithThousandSeparator(calculation.neoporezivo)}
        </td>
        <td
          style={{
            textAlign: 'right',
            backgroundColor: columColors.taxablePrice,
            width: columnWidths.taxablePrice
          }}
        >
          {numberWithThousandSeparator(calculation.oporezivo)}
        </td>
        <td
          style={{
            textAlign: 'right',
            backgroundColor: columColors.brutoTaxable,
            width: columnWidths.brutoTaxable
          }}
        >
          {numberWithThousandSeparator(calculation.brutoOporezivo)}
        </td>
        <td
          style={{
            textAlign: 'right',
            backgroundColor: columColors.tax,
            width: columnWidths.tax
          }}
        >
          {numberWithThousandSeparator(calculation.porez)}
        </td>
      </tr>
    </>
  );
}
