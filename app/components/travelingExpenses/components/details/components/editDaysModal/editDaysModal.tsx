import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

import { close } from './editDaysModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';

type Props = {
  month: number;
  year: number;
};
export default function EditDaysModal(props: Props) {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.editDaysModal;
  });

  const [days, setDays] = useState(store.relationWithDays.days);

  useEffect(() => {
    setDays(store.relationWithDays.days);
  }, [store.relationWithDays.days]);

  const handleClose = () => {
    setDays(0);
    dispatch(close());
  };

  const handleSave = () => {
    console.log(days);
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

  return (
    <Modal
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
        <div>relacija :</div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <Form.Control
            style={{ width: 70, margin: '0 auto' }}
            type="number"
            defaultValue={store.relationWithDays.days}
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
