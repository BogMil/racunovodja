import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, handleChange } from './lokacijaModal.actions';
import { AppStore } from '../../../../../reducers';
import { reloadLocations } from '../../lokacije.actions';
import * as service from '../../lokacija.service';
import { handleResponse } from '../../../../../utils/responseHandler';
import { CREATE_MODE, EDIT_MODE } from '../../../../../constants/modalModes';

export default function LokacijaModalComponent() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.lokacijeCombined.lokacijaModal;
  });
  console.log(store);
  const handleClose = () => {
    dispatch(close());
  };

  const onHandleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    dispatch(handleChange(name, value));
  };

  const handleSave = async () => {
    if (store.mode == CREATE_MODE)
      handleResponse(await service.create(store.lokacija), () => {
        dispatch(reloadLocations());
        dispatch(close());
      });
    else if (store.mode == EDIT_MODE)
      handleResponse(await service.update(store.lokacija), () => {
        dispatch(reloadLocations());
        dispatch(close());
      });
  };
  console.log(store.lokacija);
  return (
    <Modal
      backdrop="static"
      centered
      show={store.show}
      onHide={handleClose}
      className="noselect"
      size="sm"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">{store.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Naziv</Form.Label>
                <Form.Control
                  name="naziv"
                  placeholder="Unesite naziv"
                  value={store.lokacija.naziv}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Sačuvaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
