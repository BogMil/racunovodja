import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  close,
  updateEmployeeState,
  CREATE_MODE,
  EDIT_MODE
} from './employeeModal.actions';
import { AppStore } from '../../../../reducers';
import { reloadEmployees } from '../../employees.actions';
import * as Service from '../../employeeService';
import { handleResponse } from '../../../../utils/responseHandler';

export default function CreateEmployeeModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.employeeModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name == 'active') value = e.target.checked;

    dispatch(updateEmployeeState(name, value));
  };

  const handleSave = async () => {
    if (store.mode == CREATE_MODE)
      handleResponse(await Service.createEmployee(store.employee), () => {
        dispatch(reloadEmployees());
        dispatch(close());
      });
    else if (store.mode == EDIT_MODE)
      handleResponse(await Service.updateEmployee(store.employee), () => {
        dispatch(reloadEmployees());
        dispatch(close());
      });
  };
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>JMBG</Form.Label>
                <Form.Control
                  name="jmbg"
                  placeholder="Unesite JMBG"
                  value={store.employee.jmbg}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Broj zaposlenog</Form.Label>
                <Form.Control
                  name="number"
                  onChange={handleChange}
                  placeholder="Unesite broj zaposlenog"
                  value={store.employee.number}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <Form.Group>
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  name="last_name"
                  onChange={handleChange}
                  placeholder="Unesite prezime"
                  value={store.employee.last_name}
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  name="first_name"
                  onChange={handleChange}
                  placeholder="Unesite ime"
                  value={store.employee.first_name}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Broj računa</Form.Label>
                <Form.Control
                  name="banc_account"
                  onChange={handleChange}
                  placeholder="Unesite broj računa"
                  value={store.employee.banc_account}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Opština stanovanja</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="municipality_id"
                  onChange={handleChange}
                  value={store.employee.municipality_id}
                >
                  {store.municipalityOptions.map(municipality => {
                    return (
                      <option key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              custom
              name="active"
              type="checkbox"
              label="Aktivan?"
              checked={store.employee.active}
              onChange={handleChange}
            />
          </Form.Group>
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
