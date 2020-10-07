import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../reducers';
import { loadUserDetails } from './detaljiKorisnika.actions';
import { open } from './components/userDetailsModal/userDetailsModal.actions';
import UserDetailsModalComponent from './components/userDetailsModal/userDetailsModal';
import { User } from '../auth/auth.store.types';

export default function UserDetailsComponent() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.userDetailsCombined.userDetails;
  });

  const { prava_pristupa } = useSelector((state: AppStore) => {
    return state.auth.user as User;
  });

  useEffect(() => {
    dispatch(loadUserDetails());
  }, []);

  let getNazivTipaSkole = (id: number | '') => {
    switch (id) {
      case 0:
        return 'Osnovna';
      case 1:
        return 'Srednja';
      default:
        return '';
    }
  };

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
          {prava_pristupa.opiro == true && (
            <>
              <tr>
                <td>Naziv škole</td>
                <td>{store.userDetails.naziv_skole}</td>
              </tr>
              <tr>
                <td>Tip škole</td>
                <td>{getNazivTipaSkole(store.userDetails.tip_skole)}</td>
              </tr>
              <tr>
                <td>Šifra škole</td>
                <td>{store.userDetails.sifra_skole}</td>
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
                <td>{store.userDetails.opstina?.naziv}</td>
              </tr>
              <tr>
                <td>Mesto</td>
                <td>{store.userDetails.mesto}</td>
              </tr>
              <tr>
                <td>Ulica i broj</td>
                <td>{store.userDetails.ulica_i_broj}</td>
              </tr>
            </>
          )}
          <tr>
            <td>Email za slanje</td>
            <td>{store.userDetails.email_za_slanje}</td>
          </tr>
          {prava_pristupa.opiro == true && (
            <>
              <tr>
                <td>Telefon</td>
                <td>{store.userDetails.telefon}</td>
              </tr>
              <tr>
                <td>Bankovni račun</td>
                <td>{store.userDetails.bankovni_racun}</td>
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
            </>
          )}
        </tbody>
      </Table>
      <UserDetailsModalComponent />
    </div>
  );
}
