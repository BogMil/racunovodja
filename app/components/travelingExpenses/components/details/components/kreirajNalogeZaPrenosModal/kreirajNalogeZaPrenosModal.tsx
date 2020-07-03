import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';

import { close, handleChange } from './kreirajNalogeZaPrenosModal.actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppStore } from '../../../../../../reducers';
import DatePicker from 'react-datepicker';
import { get as getUserDetails } from '../../../../../userDetails/userDetails.service';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { handleResponse } from '../../../../../../utils/responseHandler';
import { createVirmaniPdfFile } from '../../../../travelingExpenses.fileCreators';
import { ObavezanPodatakNijeSetovanException } from '../../../../../../services/employeeExtractor/exceptions/obavezanPodatakNijeSetovanException';
const { dialog, getCurrentWindow } = require('electron').remote;

type Props = {
  forceUpdate: () => void;
};
export default function KreirajNalogeZaPrenosModalComponent(props: Props) {
  const dispatch = useDispatch();
  const { show, podaciONalogu } = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.kreirajNalogeZaPrenosModal;
  });
  const detailsStore = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const kreirajNalogeZaPrenos = async () => {
    handleResponse(await getUserDetails(), async (res: any) => {
      try {
        await createVirmaniPdfFile(
          detailsStore.year,
          detailsStore.month,
          detailsStore,
          res.data,
          podaciONalogu
        );
        props.forceUpdate();
        dialog.showMessageBox(getCurrentWindow(), {
          title: 'Računovođa',
          message: 'Nalozi za prenos su uspešno kreirani',
          type: 'info'
        });
        handleClose();
      } catch (e) {
        if (e instanceof ObavezanPodatakNijeSetovanException) {
          dialog.showMessageBox(getCurrentWindow(), {
            title: 'Računovođa',
            message: e.message,
            type: 'error'
          });
          return;
        }
        dialog.showMessageBox(getCurrentWindow(), {
          title: 'Računovođa',
          message: 'Nepredviđena greška',
          type: 'error'
        });
      }
    });
  };

  const onHandleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    dispatch(handleChange(name, value));
  };
  const setDatumPrijema = (date: Date) => {
    dispatch(handleChange('datumPrijema', date));
  };
  const setDatumIzvrsenja = (date: Date) => {
    dispatch(handleChange('datumIzvrsenja', date));
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
                <option value="01">Redovni troškovi (opština) - 01</option>
                <option value="04">Sopstvena sredstva - 04</option>
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
                  onChange={date => setDatumPrijema(date)}
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
                  onChange={date => setDatumIzvrsenja(date)}
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
          onClick={kreirajNalogeZaPrenos}
        >
          Kreiraj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
