import React from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close } from './DPLEmailSyncModal.actions';
import { AppStore } from '../../../../reducers';
import * as service from '../../zaposleni.service';
import {
  handleResponse,
  onFailDefault
} from '../../../../utils/responseHandler';
import { reloadEmployees } from '../../zaposleni.actions';
const { dialog, getCurrentWindow } = require('electron').remote;
export default function DPLEmailSyncModal() {
  const dispatch = useDispatch();
  const { show, employeeToSyncEmail } = useSelector((state: AppStore) => {
    return state.zaposleniPage.DPLEmailSyncModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = async () => {
    try {
      for (let { dbEmployee, dplEmployee } of employeeToSyncEmail) {
        handleResponse(
          await service.updateEmail(dbEmployee.jmbg, dplEmployee.Email),
          () => {},
          () => {
            throw new Error('Nepredviđena greška');
          },
          () => {
            throw new Error('Nepredviđena greška');
          }
        );
      }

      dispatch(reloadEmployees());
      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Računovođa',
        message: 'Uspešno upisane email adrese'
      });
    } catch (e) {
      console.log(e);
      dispatch(reloadEmployees());
      dispatch(close());
      dialog.showErrorBox('Računovođa', 'Nepredviđena greška');
    }
  };
  return (
    <Modal
      backdrop="static"
      centered
      show={show}
      onHide={handleClose}
      className="noselect"
      size="lg"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">
          Učitavanje email adresa iz dostavljača platnih listića
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: 500, overflowY: 'auto' }}>
        {employeeToSyncEmail.length > 0 ? (
          <Table>
            <tbody>
              {employeeToSyncEmail.map(({ dbEmployee, dplEmployee }, i) => (
                <tr key={i}>
                  <td>{dbEmployee.jmbg}</td>
                  <td>
                    {dbEmployee.prezime} {dbEmployee.ime}
                  </td>
                  <td>{dplEmployee.Email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>
            Nema zaposlenih kojima treba učitati email adresu iz aplikacije
            Dostavljač Platnih Listića
          </div>
        )}
      </Modal.Body>
      {employeeToSyncEmail.length > 0 ? (
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Učitaj
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}
