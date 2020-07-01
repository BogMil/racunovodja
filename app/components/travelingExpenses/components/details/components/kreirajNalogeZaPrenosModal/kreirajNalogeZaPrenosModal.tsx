import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

import { close, handleChange } from './kreirajNalogeZaPrenosModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';
import userDetails from '../../../../../userDetails/userDetails.reducer';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import sr from 'date-fns/locale/sr-Latn';
registerLocale('sr', sr);

import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default function KreirajNalogeZaPrenosModalComponent() {
  const dispatch = useDispatch();
  const { show, podaciONalogu } = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.kreirajNalogeZaPrenosModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleSave = async () => {};

  const onHandleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    dispatch(handleChange(name, value));
  };
  return (
    <Modal
      backdrop="static"
      centered
      show={show}
      onHide={close}
      className="noselect"
      size="sm"
      autoFocus
    >
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title as="h5">Kreiranje naloga za prenos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Izvor prihoda :</Form.Label>
              <Form.Control
                as="select"
                custom
                name="izvorPrihoda"
                onChange={onHandleChange}
                value={podaciONalogu.izvorPrihoda}
              >
                <option value="01">Redovni troškovi (opština)</option>
                <option value="04">Sopstvena sredstva</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Datum prijema : </Form.Label>
              <div style={{ width: '100%' }}>
                <DatePicker
                  selected={podaciONalogu.datumPrijema}
                  onChange={date => console.log(date)}
                  dateFormat=" d.M.yyyy"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Datum izvršenja : </Form.Label>
              <div style={{ width: '100%' }}>
                <DatePicker
                  selected={podaciONalogu.datumIzvrsenja}
                  onChange={date => console.log(date)}
                  dateFormat=" d.M.yyyy"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            Poziv na broj (BOP) :
            <Form.Control
              name="pozivNaBrojOdobrenje"
              placeholder="Poziv na broj - odobrenje (BOP)"
              value={podaciONalogu.pozivNaBrojOdobrenje}
              onChange={onHandleChange}
            />
          </Col>
        </Row>
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
