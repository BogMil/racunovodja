import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, handleChange } from './relationModal.actions';
import { AppStore } from '../../../../../reducers';
import { reloadRelations } from '../../relations.actions';
import * as service from '../../relations.service';
import { handleResponse } from '../../../../../utils/responseHandler';
import { CREATE_MODE, EDIT_MODE } from '../../../../../constants/modalModes';

export default function CreateEmployeeModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.relationsCombined.relationModal;
  });

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
      handleResponse(await service.create(store.relation), () => {
        dispatch(reloadRelations());
        dispatch(close());
      });
    else if (store.mode == EDIT_MODE)
      handleResponse(await service.update(store.relation), () => {
        dispatch(reloadRelations());
        dispatch(close());
      });
  };
  console.log(store.relation);
  return (
    <Modal
      backdrop="static"
      centered
      show={store.show}
      onHide={handleClose}
      className="noselect"
      size="lg"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">{store.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Od</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Unesite naziv"
                  value={store.relation.name}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Do</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="lokacija_id"
                  onChange={onHandleChange}
                  value={store.relation.lokacija_id}
                >
                  <option>---</option>;
                  {store.lokacije.map((lokacija, i) => {
                    return (
                      <option value={lokacija.id}>{lokacija.naziv}</option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>Cena (RSD)</Form.Label>
                <Form.Control
                  name="price"
                  onChange={onHandleChange}
                  placeholder="Unesite cenu"
                  value={store.relation.price}
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
