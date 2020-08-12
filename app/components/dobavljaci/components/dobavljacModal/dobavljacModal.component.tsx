import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, updateDobavljacState } from './dobavljacModal.actions';
import { AppStore } from '../../../../reducers';
import * as service from '../../dobavljaci.service';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';
import { handleResponse } from '../../../../utils/responseHandler';
import { reloadDobavljaci } from '../../dobavljaci.actions';

export default function DobavljacModalComponent() {
  const dispatch = useDispatch();
  const { show, dobavljac, title, mode } = useSelector((state: AppStore) => {
    return state.dobavljaciCombined.dobavljacModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    dispatch(updateDobavljacState(name, value));
  };

  const handleSave = async () => {
    if (mode == CREATE_MODE)
      handleResponse(await service.create(dobavljac), () => {
        dispatch(reloadDobavljaci());
        dispatch(close());
      });
    else if (mode == EDIT_MODE)
      handleResponse(await service.update(dobavljac), () => {
        dispatch(reloadDobavljaci());
        dispatch(close());
      });
  };
  return (
    <Modal
      backdrop="static"
      centered
      show={show}
      onHide={handleClose}
      className="noselect"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Naziv</Form.Label>
                <Form.Control
                  name="naziv"
                  placeholder="Unesite Naziv"
                  value={dobavljac.naziv}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Adresa</Form.Label>
                <Form.Control
                  name="adresa"
                  onChange={handleChange}
                  placeholder="Unesite adresu"
                  value={dobavljac.adresa}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>PIB</Form.Label>
                <Form.Control
                  name="pib"
                  onChange={handleChange}
                  placeholder="Unesite PIB"
                  value={dobavljac.pib}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Žiro račun</Form.Label>
                <Form.Control
                  name="ziro_racun"
                  onChange={handleChange}
                  placeholder="Unesite žiro račun"
                  value={dobavljac.ziro_racun}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Kontakt</Form.Label>
                <Form.Control
                  name="kontakt"
                  onChange={handleChange}
                  placeholder="Unesite kontakt"
                  value={dobavljac.kontakt}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  onChange={handleChange}
                  placeholder="Unesite email"
                  value={dobavljac.email}
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
