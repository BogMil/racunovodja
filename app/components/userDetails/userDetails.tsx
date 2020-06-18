import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../reducers';
import { loadUserDetails } from './userDetails.actions';
import { open } from './components/userDetailsModal/userDetailsModal.actions';
import UserDetailsModalComponent from './components/userDetailsModal/userDetailsModal';

export default function UserDetailsComponent() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.userDetailsCombined.userDetails;
  });

  useEffect(() => {
    dispatch(loadUserDetails());
  }, []);

  return (
    <div className="noselect">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th style={{ width: 300 }}></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Naziv škole</td>
            <td>{store.userDetails.naziv_skole}</td>
          </tr>
          <tr>
            <td>Maticni broj</td>
            <td>{store.userDetails.maticni_broj}</td>
          </tr>
          <tr>
            <td>Poreski identifikacioni broj</td>
            <td>{store.userDetails.poreski_identifikacioni_broj}</td>
          </tr>
          <tr>
            <td>Opstina</td>
            <td>{store.userDetails.municipality?.name}</td>
          </tr>
          <tr>
            <td>Ulica i broj</td>
            <td>{store.userDetails.ulica_i_broj}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{store.userDetails.email}</td>
          </tr>
          <tr>
            <td>Telefon</td>
            <td>{store.userDetails.telefon}</td>
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center' }}>
              <Button
                variant="warning"
                onClick={() => dispatch(open(store.userDetails))}
              >
                <i className="fa fa-edit" />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      <UserDetailsModalComponent />
    </div>
  );
}
