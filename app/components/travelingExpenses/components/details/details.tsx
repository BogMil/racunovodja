import React, { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import routes from '../../../../constants/routes.json';
import { handleResponse } from '../../../../utils/responseHandler';
import * as service from '../../travelingExpenses.service';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import { loadTravelingExpenseDetails } from './details.actions';
import getMonthName from '../../../../utils/getMonthName';
import {
  EmployeeWithRelation,
  RelationWithDays
} from '../../travelingExpenses.types';

export default function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });
  useEffect(() => {
    dispatch(loadTravelingExpenseDetails(id));
  }, []);
  console.log(store);
  return (
    <Container style={{}}>
      <Row>
        <Col md={1} style={{ float: 'right', paddingLeft: 0 }}>
          <NavLink
            to={{
              pathname: routes.TRAVEL_EXPENSES
            }}
          >
            <Button style={{ paddingTop: 2, paddingBottom: 2 }}>
              <FontAwesomeIcon icon={faChevronLeft} />{' '}
            </Button>
          </NavLink>
        </Col>

        <Col style={{ textAlign: 'center' }} md={10}>
          Obračun putnih troškova za {getMonthName(store.month)} / {store.year}.
        </Col>
      </Row>
      <Row>
        <Col style={{ padding: 0 }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>JMBG</th>
                <th>Prezime i ime</th>
                <th>Relacija</th>
                <th>Cena</th>
                <th>Dana</th>
                <th>Ukupno</th>
                <th>Neopor.</th>
                <th>Opor.</th>
                <th style={{ textAlign: 'center', width: 50 }}>
                  <Button
                    // onClick={openCreateDialog}
                    title="Kreiraj novi obračun putnih troškova"
                    variant="success"
                    style={{
                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginRight: 5
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {store.employees_with_relation &&
                store.employees_with_relation.map(
                  (employeeWithRelation: EmployeeWithRelation, index) => (
                    <tr key={index}>
                      <td>{employeeWithRelation.employee.jmbg}</td>
                      <td>
                        {employeeWithRelation.employee.last_name}{' '}
                        {employeeWithRelation.employee.first_name}
                      </td>
                      <td>
                        <Table style={{ marginBottom: 0 }}>
                          <tbody>
                            {employeeWithRelation.relations_with_days &&
                              employeeWithRelation.relations_with_days.map(
                                (relationWithDays: RelationWithDays, i) => (
                                  <tr>
                                    <td>{relationWithDays.relation.name}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </td>
                      <td>
                        <Table>
                          <tbody>
                            {employeeWithRelation.relations_with_days &&
                              employeeWithRelation.relations_with_days.map(
                                (relationWithDays: RelationWithDays, i) => (
                                  <tr>
                                    <td>{relationWithDays.relation.price}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </td>
                      <td>
                        <Table>
                          <tbody>
                            {employeeWithRelation.relations_with_days &&
                              employeeWithRelation.relations_with_days.map(
                                (relationWithDays: RelationWithDays, i) => (
                                  <tr>
                                    <td>{relationWithDays.days}</td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </td>

                      <td>
                        <Table>
                          <tbody>
                            {employeeWithRelation.relations_with_days &&
                              employeeWithRelation.relations_with_days.map(
                                (relationWithDays: RelationWithDays, i) => (
                                  <tr>
                                    <td>
                                      {relationWithDays.days *
                                        relationWithDays.relation.price}
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
