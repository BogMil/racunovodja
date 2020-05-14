import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close } from './addDefaultRelationModal.actions';
import { AppStore } from '../../../../reducers';
import { reloadEmployee } from '../../employees.actions';

export default function AddDefaultRealtionModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.addDefaultRelationModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = () => {
    dispatch(reloadEmployee(store.employee.id));
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
            {store.employee?.lastName} {store.employee?.firstName}
          </b>
        </div>
        <Form>
          <Form.Control as="select" custom>
            {store.availableRelations.map(relation => {
              return <option key={relation.id}>{relation.name}</option>;
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
