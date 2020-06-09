import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import {
  close,
  setSelectedRelationId
} from './addRelationWithDaysModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';
import * as service from '../../../../travelingExpenses.service';
import { reloadTravelingExpenseDetails } from '../../details.actions';
import { handleResponse } from '../../../../../../utils/responseHandler';

export default function AddRelationWithDaysModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.addRelationWithDays;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;

    if (name == 'active') value = e.target.checked;

    dispatch(setSelectedRelationId(value));
  };
  const handleSave = async () => {
    // if (store.selectedEmployeeId > 0)
    //   handleResponse(
    //     await service.addEmployee(
    //       store.selectedEmployeeId,
    //       store.travelingExpenseId
    //     ),
    //     () => {
    //       dispatch(reloadTravelingExpenseDetails(store.travelingExpenseId));
    //       handleClose();
    //     }
    //   );
  };

  return (
    <Modal
      backdrop="static"
      centered
      show={store.show}
      onHide={close}
      className="noselect"
      autoFocus
    >
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title as="h5">
          Dodavanje zaposlenog u obračun putnih troškova
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            as="select"
            custom
            name="municipality_id"
            onChange={handleChange}
            value={store.selectedRelationId}
          >
            <option value={-1}>---</option>
            {store.relations.map(relation => {
              return (
                <option key={relation.id} value={relation.id}>
                  {relation.name} : {relation.price} RSD
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          style={{ margin: '0 auto' }}
          variant="primary"
          onClick={handleSave}
        >
          Dodaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
