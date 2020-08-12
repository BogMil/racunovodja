import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import {
  close,
  setSelectedRelationId
} from './addRelationWithDaysModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';
import * as service from '../../../../travelingExpenses.service';
import { reloadCurrentTravelingExpenseDetails } from '../../details.actions';
import { handleResponse } from '../../../../../../utils/responseHandler';

type Props = {
  month: number;
  year: number;
};

export default function AddRelationWithDaysModal(props: Props) {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.addRelationWithDays;
  });

  const [days, setDays] = useState(0);

  const handleClose = () => {
    setDays(0);
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;

    if (name == 'active') value = e.target.checked;

    dispatch(setSelectedRelationId(value));
  };

  const handleChangeDays = (e: any) => {
    let newDays = e.target.value;
    if (newDays < 0 || newDays > daysInMonth()) {
      const { dialog, getCurrentWindow } = require('electron').remote;
      dialog.showMessageBox(getCurrentWindow(), {
        message: `Broj dana (${newDays}) nije odgovarajuć!`,
        title: 'Greška',
        type: 'warning'
      });
      return;
    }
    setDays(newDays);
  };
  const handleSave = async () => {
    if (store.selectedRelationId > 0)
      handleResponse(
        await service.addRelationWithDays(
          store.travelingExpenseEmployeeId,
          store.selectedRelationId,
          days
        ),
        () => {
          dispatch(reloadCurrentTravelingExpenseDetails());
          handleClose();
        }
      );
  };

  function daysInMonth() {
    return new Date(props.year, props.month, 0).getDate();
  }

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
        <Modal.Title as="h5">Dodavanje relacije zaposlenom</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Relacija</Form.Label>
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
                  {relation.name} - {relation.lokacija.naziv} : {relation.price}{' '}
                  RSD
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <Form.Label>Broj dana</Form.Label>
          <Form.Control
            style={{ width: 70, margin: '0 auto' }}
            type="number"
            value={days}
            onChange={handleChangeDays}
          ></Form.Control>
        </div>
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
