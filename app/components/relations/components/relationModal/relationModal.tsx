import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, handleChange } from './relationModal.actions';
import { AppStore } from '../../../../reducers';
import { reloadRelations } from '../../relations.actions';
import * as service from '../../relations.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';

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
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">{store.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Naziv</Form.Label>
                <Form.Control
                  name="name"
                  placeholder="Unesite naziv relacije"
                  value={store.relation.name}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
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
