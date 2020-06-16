import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../reducers';
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
import {
  GET_PUTNI_TROSKOVI_PPP_PD_DIR,
  GET_PUTNI_TROSKOVI_PPP_PD_FILE
} from '../../constants/files';
import { U_RADU, ZAVRSEN } from '../../constants/statuses';
const { shell } = require('electron');
var fs = require('fs');

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

  const createXml = (year: number, month: number) => {
    shell.openItem(GET_PUTNI_TROSKOVI_PPP_PD_DIR(year, month));
  };

  const PPP_PD_EXIST = (year: number, month: number) => {
    return fs.existsSync(GET_PUTNI_TROSKOVI_PPP_PD_FILE(year, month));
  };

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Mesec</th>
            <th>Godina</th>
            <th>Datum kreiranja</th>
            <th>Status</th>
            <th style={{ textAlign: 'center', width: 100 }}>
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
                <i className="fas fa-plus"></i>
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
                <td>
                  {te.status == U_RADU.value ? U_RADU.label : ZAVRSEN.label}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <NavLink
                    to={{
                      pathname: `${routes.TRAVEL_EXPENSES_DETAILS}/${te.id}`
                    }}
                  >
                    <DetailsRowButton title="Detalji" onClick={() => {}} />
                  </NavLink>
                  {PPP_PD_EXIST(te.year, te.month) && (
                    <Button
                      variant="info"
                      title="Otvori folder"
                      onClick={() => createXml(te.year, te.month)}
                      style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 5,
                        paddingRight: 5,
                        height: 25,
                        marginLeft: 5
                      }}
                    >
                      <i className="fa fa-file-code" />
                    </Button>
                  )}
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
