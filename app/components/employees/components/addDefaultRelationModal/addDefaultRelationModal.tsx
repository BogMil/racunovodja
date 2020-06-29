import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, handleChange } from './addDefaultRelationModal.actions';
import { AppStore } from '../../../../reducers';
import { reloadEmployees } from '../../employees.actions';
import * as service from '../../employee.service';

export default function AddDefaultRealtionModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.addDefaultRelationModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = () => {
    if (store.selectedRelation <= 0) {
      const { dialog, getCurrentWindow } = require('electron').remote;

      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Greška',
        message: 'Odaberite podrazumevanu relaciju',
        type: 'warning'
      });

      return;
    }
    service.addDefaultRelation(store.employee.id, store.selectedRelation);
    dispatch(reloadEmployees());
    dispatch(close());
  };

  const onHandleChange = (e: any) => {
    dispatch(handleChange(e.target.value));
  };

  return (
    <Modal
      backdrop="static"
      centered
      show={store.show}
      onHide={handleClose}
      className="noselect"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">Dodavanje podrazumevane relacije</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div style={{ paddingBottom: 10 }}>
          zaposlenom:{' '}
          <b>
            {store.employee?.last_name} {store.employee?.first_name}
          </b>
        </div>
        <Form>
          <Form.Control
            as="select"
            custom
            value={store.selectedRelation}
            onChange={onHandleChange}
          >
            <option value="-1">---</option>
            {store.availableRelations.map(relation => {
              return (
                <option key={relation.id} value={relation.id}>
                  {relation.name} - {relation.lokacija?.naziv}
                </option>
              );
            })}
          </Form.Control>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Dodaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
