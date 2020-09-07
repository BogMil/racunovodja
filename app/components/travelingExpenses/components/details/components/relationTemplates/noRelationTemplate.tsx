import React from 'react';
import { Button } from 'react-bootstrap';
import { EmployeeWithRelations } from '../../../../travelingExpenses.types';
import DeleteRowButton from '../../../../../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../../../../../utils/yesNoModal';
import { handleResponse } from '../../../../../../utils/responseHandler';
import * as service from '../../../../travelingExpenses.service';
import { useDispatch, useSelector } from 'react-redux';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { open as openAddRelationWithDaysMoad } from '../addRelationWithDaysModal/addRelationWithDaysModal.actions';
import { U_RADU } from '../../../../../../constants/statuses';
import { AppStore } from '../../../../../../reducers';

type Props = {
  employeeWithRelation: EmployeeWithRelations;
};

export default function NoRelationTemplate(props: Props) {
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

  const onAddRelationWithDays = () => {
    dispatch(openAddRelationWithDaysMoad(props.employeeWithRelation.id));
  };

  let { status } = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  return (
    <tr style={{ borderBottom: '2px solid #3f0e40' }}>
      <td style={{ verticalAlign: 'middle' }}>
        {props.employeeWithRelation.employee.jmbg}
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        <div style={{ display: 'inline-block' }}>
          {props.employeeWithRelation.employee.prezime}{' '}
          {props.employeeWithRelation.employee.ime}
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
      <td colSpan={8} style={{ padding: 0, verticalAlign: 'middle' }}></td>
      {status == U_RADU.value ? (
        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
