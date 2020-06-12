import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import { close } from './editDaysModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';
import * as service from '../../../../travelingExpenses.service';
import { reloadCurrentTravelingExpenseDetails } from '../../details.actions';
import { handleResponse } from '../../../../../../utils/responseHandler';

type Props = {
  month: number;
  year: number;
};
export default function EditDaysModal(props: Props) {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.editDaysModal;
  });

  const currentDays =
    store.relationWithDays.days != null ? store.relationWithDays.days : 0;
  const [days, setDays] = useState(currentDays);

  useEffect(() => {
    const currentDays =
      store.relationWithDays.days != null ? store.relationWithDays.days : 0;
    setDays(currentDays);
  }, [store.relationWithDays.days]);

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = async () => {
    handleResponse(
      await service.addDaysToRelation(store.relationWithDays.id, days),
      () => {
        dispatch(reloadCurrentTravelingExpenseDetails());
        dispatch(close());
      }
    );
    service.addDaysToRelation(store.relationWithDays.id, days);
  };

  const handleChange = (e: any) => {
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
  function daysInMonth() {
    return new Date(props.year, props.month, 0).getDate();
  }
  function onShow() {
    let daysInput = document.getElementById('asd');
    daysInput?.focus();
  }

  return (
    <Modal
      onShow={onShow}
      backdrop="static"
      centered
      show={store.show}
      onHide={close}
      className="noselect"
      size="sm"
      autoFocus
    >
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title as="h5">Promena broja dana</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {store.employee.last_name} {store.employee.first_name}
        </div>
        <div>
          relacija :{' '}
          {store.relationWithDays &&
            store.relationWithDays.relation &&
            store.relationWithDays.relation.name}
        </div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Form.Control
            id="asd"
            style={{ width: 70, margin: '0 auto' }}
            type="number"
            value={days}
            onChange={handleChange}
          ></Form.Control>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          style={{ margin: '0 auto' }}
          variant="primary"
          onClick={handleSave}
        >
          Sačuvaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
