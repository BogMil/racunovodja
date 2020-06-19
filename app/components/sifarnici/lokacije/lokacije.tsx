import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../reducers';
import { loadLocations } from './lokacije.actions';
import {
  openCreate,
  openEdit
} from './components/lokacijaModal/lokacijaModal.actions';
import { Lokacija } from './lokacije.types';
import LokacijaModalComponent from './components/lokacijaModal/lokacijaModal';
import EditRowButton from '../../common/rowButtons/editRowButton';
import DeleteRowButton from '../../common/rowButtons/deleteRowButton';
import { areYouSure } from '../../../utils/yesNoModal';
import { handleResponse } from '../../../utils/responseHandler';
import * as service from './lokacija.service';

export default function LokacijeComponent() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.lokacijeCombined.lokacije;
  });

  useEffect(() => {
    dispatch(loadLocations());
  }, []);

  const openCreateDialog = () => {
    dispatch(openCreate());
  };

  const edit = (lokacija: Lokacija) => {
    dispatch(openEdit(lokacija));
  };

  const remove = (id: number) => {
    areYouSure({
      title: 'Brisanje relacije',
      onYes: async () => {
        handleResponse(await service.remove(id), () => {
          dispatch(loadLocations());
        });
      }
    });
  };

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th style={{ textAlign: 'center', width: 70 }}>
              <Button
                onClick={openCreateDialog}
                title="Kreiraj novu relaciju"
                variant="success"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginRight: 5
                }}
              >
                <i className="fa fa-plus" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {store.lokacije.map((lokacija: Lokacija, i) => (
            <tr key={i}>
              <td>{lokacija.naziv}</td>
              <td style={{ textAlign: 'center' }}>
                <EditRowButton
                  onClick={() => {
                    edit(lokacija);
                  }}
                  title="Ažuriranje relacije"
                  style={{ marginRight: 5 }}
                />

                <DeleteRowButton
                  onClick={() => {
                    remove(lokacija.id);
                  }}
                  title="Brisanje relacije"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <LokacijaModalComponent />
    </>
  );
}
