import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../reducers';
import { loadDobavljaci } from './dobavljaci.actions';
import { areYouSure } from '../../utils/yesNoModal';
import { handleResponse } from '../../utils/responseHandler';
import * as service from './dobavljaci.service';
import { Dobavljac } from './dobavljaci.types';
import EditRowButton from '../common/rowButtons/editRowButton';
import DeleteRowButton from '../common/rowButtons/deleteRowButton';
import {
  openCreate,
  openEdit
} from './components/dobavljacModal/dobavljacModal.actions';
import DobavljacModalComponent from './components/dobavljacModal/dobavljacModal.component';

export default function DobavljaciComponent() {
  const dispatch = useDispatch();
  const { dobavljaci } = useSelector((state: AppStore) => {
    return state.dobavljaciCombined.dobavljaci;
  });

  useEffect(() => {
    dispatch(loadDobavljaci());
  }, []);

  const openEditModal = (dobavljac: Dobavljac) => {
    dispatch(openEdit(dobavljac));
  };

  const remove = (id: number) => {
    areYouSure({
      title: 'Brisanje relacije',
      onYes: async () => {
        handleResponse(await service.remove(id), () => {
          dispatch(loadDobavljaci());
        });
      }
    });
  };

  const openCreateModal = () => {
    dispatch(openCreate());
  };
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>PIB</th>
            <th>Žiro račun</th>
            <th style={{ textAlign: 'center', width: 70 }}>
              <Button
                onClick={openCreateModal}
                title="Kreiraj novog dobavljača"
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
          {dobavljaci.map((dobavljac: Dobavljac, i) => (
            <tr key={i}>
              <td>{dobavljac.naziv}</td>
              <td>{dobavljac.pib}</td>
              <td>{dobavljac.ziro_racun}</td>
              <td style={{ textAlign: 'center' }}>
                <EditRowButton
                  onClick={() => {
                    openEditModal(dobavljac);
                  }}
                  title="Ažuriranje relacije"
                  style={{ marginRight: 5 }}
                />

                <DeleteRowButton
                  onClick={() => {
                    remove(dobavljac.id);
                  }}
                  title="Brisanje relacije"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <DobavljacModalComponent />
    </>
  );
}
