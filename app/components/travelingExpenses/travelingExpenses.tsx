import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../reducers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { loadTravelingExpenses } from './travelingExpenses.actions';
import { openCreate } from './components/travelingExpenseModal/travelingExpenseModal.actions';
import TravelingExpenseModal from './components/travelingExpenseModal/travelingExpenseModal';
import DetailsRowButton from '../common/rowButtons/detailsRowButton';
import { NavLink } from 'react-router-dom';
import routes from '../../constants/routes.json';

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

  // const openUploadDialog = () => {
  //   dispatch(open());
  // };
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Mesec</th>
            <th>Godina</th>
            <th>Datum kreiranja</th>
            <th style={{ textAlign: 'center', width: 50 }}>
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
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <TravelingExpenseModal />
    </>
  );
}
