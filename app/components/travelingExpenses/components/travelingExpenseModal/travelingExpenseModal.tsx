import React from 'react';
import { Button, Modal, Form, Row, Col, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  close,
  updateTravelingExpenseState,
  checkAll
} from './travelingExpenseModal.actions';
import { AppStore } from '../../../../reducers';
import EmployeeComponent from './components/employee';
import * as service from '../../travelingExpenses.service';
import { CREATE_MODE } from '../../../../constants/modalModes';
import { handleResponse } from '../../../../utils/responseHandler';
import { reloadTravelingExpenses } from '../../travelingExpenses.actions';

export default function TravelingExpenseModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseModal;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    dispatch(updateTravelingExpenseState(name, value));
  };

  const onCheckAll = () => {
    dispatch(checkAll());
  };

  const handleSave = async () => {
    let employeeIds = store.employees
      .filter(e => {
        if (e.checked) return e.id;
      })
      .map(r => r.id);

    let x = {
      employees: employeeIds,
      month: store.travelingExpense.month,
      year: store.travelingExpense.year
    };

    if (store.mode == CREATE_MODE)
      handleResponse(await service.create(x), () => {
        dispatch(reloadTravelingExpenses());
        dispatch(close());
      });
    // else if (store.mode == EDIT_MODE)
    //   handleResponse(await Service.updateEmployee(store.employee), () => {
    //     dispatch(reloadEmployees());
    //     dispatch(close());
    //   });
  };

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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mesec</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="month"
                  onChange={handleChange}
                  value={store.travelingExpense.month}
                >
                  <option value={1}>Januar</option>
                  <option value={2}>Februar</option>
                  <option value={3}>Mart</option>
                  <option value={4}>April</option>
                  <option value={5}>Maj</option>
                  <option value={6}>Jun</option>
                  <option value={7}>Jul</option>
                  <option value={8}>Avgust</option>
                  <option value={9}>Septembar</option>
                  <option value={10}>Oktobar</option>
                  <option value={11}>Novembar</option>
                  <option value={12}>Decembar</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Godina</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="year"
                  onChange={handleChange}
                  value={store.travelingExpense.year}
                >
                  <option value={2020}>2020</option>
                  <option value={2021}>2021</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              Izbor zaposlenih kojima će se obračunavati putni troškovi :
            </Col>
          </Row>
          <Row>
            <Col>
              <div
                style={{
                  maxHeight: 500,
                  border: '1px solid black',
                  overflowY: 'auto',
                  overflowX: 'auto'
                }}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>
                        {' '}
                        <Form.Check
                          name="active"
                          type="checkbox"
                          label=""
                          checked={store.checkAll}
                          onChange={onCheckAll}
                        />
                      </th>
                      <th>JMBG</th>
                      <th>Broj zaposlenog</th>
                      <th>Prezime</th>
                      <th>Ime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.employees.map(e => (
                      <EmployeeComponent key={e.id} employee={e} />
                    ))}
                  </tbody>
                </Table>
              </div>
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
