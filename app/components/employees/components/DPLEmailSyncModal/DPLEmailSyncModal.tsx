import React from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close } from './DPLEmailSyncModal.actions';
import { AppStore } from '../../../../reducers';
import * as service from '../../employee.service';
import {
  handleResponse,
  onFailDefault
} from '../../../../utils/responseHandler';
import { reloadEmployees } from '../../employees.actions';
const { dialog, getCurrentWindow } = require('electron').remote;
export default function DPLEmailSyncModal() {
  const dispatch = useDispatch();
  const { show, employeeToSyncEmail } = useSelector((state: AppStore) => {
    return state.employeesCombined.DPLEmailSyncModal;
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
          onFailDefault,
          (response: any) => {
            if (response.message)
              if (typeof response.message == 'string')
                throw new Error(response.message);
              else throw new Error('Nepredviđena greška');
          }
        );
      }

      dispatch(reloadEmployees());
      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Računovođa',
        message: 'Uspešno upisane email adrese'
      });
    } catch (e) {
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
                    {dbEmployee.last_name} {dbEmployee.first_name}
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
