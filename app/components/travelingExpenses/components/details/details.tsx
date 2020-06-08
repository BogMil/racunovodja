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
  EmployeeWithRelations,
  RelationWithDays
} from '../../travelingExpenses.types';
import OneRelationTemplate from './components/oneRelationTemplate';
import NoRelationTemplate from './components/noRelationTemplate';
import MultipleRelationsTemplate from './components/mulitpleRelationsTemplate';
import EditDaysModal from './components/editDaysModal/editDaysModal';

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
    <Container
      fluid
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap'
      }}
      className="noselect"
    >
      <Row
        style={{
          flexShrink: 0,
          // position: 'fixed',
          // top: 25,
          backgroundColor: '#d8eacd'
          // width: '100%',
          // height: 30,
          // zIndex: 999
        }}
      >
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

        <Col md={11}>
          <b>
            Obračun putnih troškova za {getMonthName(store.month)} /{' '}
            {store.year}.
          </b>
        </Col>
      </Row>
      <Row
        style={{
          // marginBottom: 50, marginTop: 30
          flexGrow: 1,
          overflow: 'auto',
          minHeight: '2em'
        }}
      >
        <Col style={{ padding: 0 }}>
          <Table striped bordered hover size="sm" style={{}}>
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
                <th style={{ textAlign: 'center' }}>
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
            <tbody
              style={{
                overflowY: 'auto',
                height: 500
              }}
            >
              {store.employees_with_relation &&
                store.employees_with_relation.map(
                  (employeeWithRelation: EmployeeWithRelations, index) => {
                    if (employeeWithRelation.relations_with_days.length == 0)
                      return (
                        <NoRelationTemplate
                          key={index}
                          employeeWithRelation={employeeWithRelation}
                        />
                      );
                    else if (
                      employeeWithRelation.relations_with_days.length == 1
                    )
                      return (
                        <OneRelationTemplate
                          key={index}
                          employeeWithRelation={employeeWithRelation}
                        />
                      );
                    else if (
                      employeeWithRelation.relations_with_days.length > 1
                    )
                      return (
                        <MultipleRelationsTemplate
                          key={index}
                          employeeWithRelation={employeeWithRelation}
                        />
                      );

                    return null;
                  }
                )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row
        style={{
          // position: 'fixed',
          // bottom: 0,
          backgroundColor: '#d8eacd',
          // width: '100%',
          // height: 50
          flexShrink: 0
        }}
      >
        <Col>
          <div>asdasd</div>
        </Col>
      </Row>
      <EditDaysModal year={store.year} month={store.month} />
    </Container>
  );
}
