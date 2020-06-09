import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../reducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  loadTravelingExpenses,
  reloadTravelingExpenses
} from './travelingExpenses.actions';
import { openCreate } from './components/travelingExpenseModal/travelingExpenseModal.actions';
import TravelingExpenseModal from './components/travelingExpenseModal/travelingExpenseModal';
import DetailsRowButton from '../common/rowButtons/detailsRowButton';
import { NavLink } from 'react-router-dom';
import routes from '../../constants/routes.json';
import DeleteRowButton from '../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../utils/yesNoModal';
import { handleResponse } from '../../utils/responseHandler';
import * as service from './travelingExpenses.service';

export default function TravelExpenses() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenses;
  });

  useEffect(() => {
    dispatch(loadTravelingExpenses());
  }, []);

  const openCreateDialog = () => {
    dispatch(openCreate());
  };

  const onRemoveTravelingExpense = (id: number) => {
    areYouSure({
      onYes: async () => {
        handleResponse(await service.remove(id), () => {
          dispatch(reloadTravelingExpenses());
        });
      },
      title: 'Brisanje obračuna putnih troškova'
    });
  };
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Mesec</th>
            <th>Godina</th>
            <th>Datum kreiranja</th>
            <th style={{ textAlign: 'center', width: 70 }}>
              <Button
                onClick={openCreateDialog}
                title="Kreiraj novi obračun putnih troškova"
                variant="success"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginRight: 5
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {store.travelingExpenses &&
            store.travelingExpenses.map((te, index) => (
              <tr key={index}>
                <td>{te.month}</td>
                <td>{te.year}</td>
                <td>{te.creation_date}</td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink
                    to={{
                      pathname: `${routes.TRAVEL_EXPENSES_DETAILS}/${te.id}`
                    }}
                  >
                    <DetailsRowButton title="Detalji" onClick={() => {}} />
                  </NavLink>
                  <DeleteRowButton
                    style={{ marginLeft: 5 }}
                    title="Ukloni obračun putnih troškova!"
                    onClick={() => onRemoveTravelingExpense(te.id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <TravelingExpenseModal />
    </>
  );
}
