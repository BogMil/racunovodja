import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Zaposleni, ZaposleniCDTO } from '../../zaposleni.types';
import { useDispatch, useSelector } from 'react-redux';
import * as AddDefaultRelationModalActions from '../addDefaultRelationModal/addDefaultRelationModal.actions';
import {
  removeRelationFromEmployee,
  reloadEmployees
} from '../../zaposleni.actions';
import styles from './employee.css';
import * as Service from '../../zaposleni.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { openEdit } from '../zaposleniModal/zaposleniModal.actions';
import DeleteRowButton from '../../../common/rowButtons/deleteRowButton';
import EditRowButton from '../../../common/rowButtons/editRowButton';
import { areYouSure } from '../../../../utils/yesNoModal';
import { columnWidths } from '../../zaposleni.columnStyle';
import { AppStore } from '../../../../reducers';
import { User } from '../../../auth/auth.store.types';

type Props = {
  zaposleni: Zaposleni;
};

export default function EmployeeComponent(props: Props) {
  const dispatch = useDispatch();
  let zaposleni = props.zaposleni;

  const { prava_pristupa } = useSelector((state: AppStore) => {
    return state.auth.user as User;
  });

  const onAddDefaultRelationClick = () => {
    dispatch(AddDefaultRelationModalActions.open(zaposleni));
  };

  const removeRelation = (defaultRelationId: number) => {
    areYouSure({
      title: 'Brisanje zaposlenog',
      onYes: async () => {
        handleResponse(
          await Service.removeDefaultRelation(zaposleni.id, defaultRelationId),
          () => {
            dispatch(
              removeRelationFromEmployee(zaposleni.id, defaultRelationId)
            );
          }
        );
      }
    });
  };

  const removeEmployee = () => {
    areYouSure({
      title: 'Brisanje zaposlenog',
      onYes: async () => {
        handleResponse(await Service.removeEmployee(zaposleni.id), () => {
          dispatch(reloadEmployees());
        });
      }
    });
  };

  const editEmployee = () => {
    let cdto = (zaposleni as unknown) as ZaposleniCDTO;
    cdto.id_opstine = zaposleni.opstina ? zaposleni.opstina.id : '';
    dispatch(openEdit(cdto));
  };

  return (
    <tr style={{ backgroundColor: !zaposleni.aktivan ? '#FFD7D7' : '' }}>
      <td style={{ width: columnWidths.jmbg }} className={styles.employeeCell}>
        {zaposleni.jmbg}
      </td>
      <td style={{ width: columnWidths.broj }} className={styles.employeeCell}>
        {zaposleni.sifra}
      </td>
      <td
        style={{ width: columnWidths.prezime }}
        className={styles.employeeCell}
      >
        {zaposleni.prezime}
      </td>
      <td style={{ width: columnWidths.ime }} className={styles.employeeCell}>
        {zaposleni.ime}
      </td>
      <td
        style={{ width: columnWidths.brojRacuna }}
        className={styles.employeeCell}
      >
        {zaposleni.bankovni_racun}
      </td>
      {prava_pristupa.opiro && (
        <>
          <td
            style={{ width: columnWidths.opstina }}
            className={styles.employeeCell}
          >
            {zaposleni.opstina ? zaposleni.opstina.naziv : '---'}
          </td>
          <td
            className={styles.employeeCell}
            style={{ width: columnWidths.relacije }}
          >
            <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
              <tbody>
                {zaposleni.default_relations?.map((defaultRelation, i) => (
                  <tr key={i}>
                    <td style={{ padding: 0 }}>
                      <div style={{ float: 'left' }}>
                        {defaultRelation.name} -{' '}
                        {defaultRelation.lokacija?.naziv}
                      </div>
                      <div style={{ float: 'right' }}>
                        <DeleteRowButton
                          title="Ukloni podrazumevanu relaciju"
                          onClick={() => removeRelation(defaultRelation.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: 0 }}>
                    <Button
                      variant="success"
                      onClick={() => onAddDefaultRelationClick()}
                      style={{ width: '100%', padding: 0, height: 20 }}
                      title="Dodaj podrazumevanu relaciju"
                    >
                      +
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </td>
        </>
      )}
      <td style={{ width: columnWidths.email }} className={styles.employeeCell}>
        {zaposleni.email}
      </td>

      <td style={{ textAlign: 'center', width: columnWidths.email }}>
        <EditRowButton
          onClick={editEmployee}
          title="Ažuriranje zaposlenog"
          style={{ marginRight: 5 }}
        />

        <DeleteRowButton title="Brisanje zaposlenog" onClick={removeEmployee} />
      </td>
    </tr>
  );
}
