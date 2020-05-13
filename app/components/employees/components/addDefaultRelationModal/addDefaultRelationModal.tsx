import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { DefaultRelation } from '../../models/employee';
import * as Service from '../../employeeService';
import { useSelector } from 'react-redux';

export default function AddDefaultRealtionModal() {
  const [relations, setRelations] = useState<DefaultRelation[]>([]);

  const addDefaultRealtionModal = useSelector(
    (state: any) => state.addDefaultRealtionModal
  );

  useEffect(() => {
    let relations = Service.getAvailableDefaultRelationsForEmployee(1);
    setRelations(relations);
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Dialog className="noselect">
        <Modal.Header closeButton style={{}}>
          <Modal.Title as="h5">Dodavanje podrazumevane relacije</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Control as="select" custom>
              {relations.map(relation => {
                <option key={relation.id}>{relation.name}</option>;
              })}
            </Form.Control>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary">Dodaj</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal>
  );
}
