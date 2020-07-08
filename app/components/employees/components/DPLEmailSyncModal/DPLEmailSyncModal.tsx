import React from 'react';
import { Button, Modal, Form, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close } from './DPLEmailSyncModal.actions';
import { AppStore } from '../../../../reducers';

export default function DPLEmailSyncModal() {
  const dispatch = useDispatch();
  const { show, employeeToSyncEmail } = useSelector((state: AppStore) => {
    return state.employeesCombined.DPLEmailSyncModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = () => {};
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
        <Modal.Title as="h5">Dodavanje podrazumevane relacije</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table>
          <tbody>
            {employeeToSyncEmail.map(({ dbEmployee, dplEmployee }, i) => (
              <tr key={i}>
                <td>
                  {dbEmployee.last_name} {'->'} {dplEmployee.Email}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Dodaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
