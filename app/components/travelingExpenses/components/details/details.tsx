import React, { useEffect } from 'react';
import { useParams, NavLink, useLocation } from 'react-router-dom';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import routes from '../../../../constants/routes.json';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import { loadTravelingExpenseDetails, _loadTravelingExpenseDetails } from './details.actions';
import getMonthName from '../../../../utils/getMonthName';
import { EmployeeWithRelations } from '../../travelingExpenses.types';
import OneRelationTemplate from './components/relationTemplates/oneRelationTemplate';
import NoRelationTemplate from './components/relationTemplates/noRelationTemplate';
import MultipleRelationsTemplate from './components/relationTemplates/mulitpleRelationsTemplate';
import EditDaysModal from './components/editDaysModal/editDaysModal';
import { open } from './components/addEmployeeModal/addEmployeeModal.actions';
import AddEmployeeModal from './components/addEmployeeModal/addEmployeeModal';
import AddRelationWithDaysModal from './components/addRelationWithDaysModal/addRelationWithDaysModal';
import { initialState } from './details.reducer';
import { columnWidths } from './details.columnWidths';

export default function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  useEffect(() => {
    dispatch(loadTravelingExpenseDetails(id));

    return function(){
     dispatch(_loadTravelingExpenseDetails(initialState));
    }
  }, []);

  const openAddEmployeeDialog = async () => {
    dispatch(open(store.id));
  };

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
          <Table striped bordered hover size="sm" style={{width:columnWidths.sum()}}>
            <thead>
              <tr>
                <th style={{width:columnWidths.jmbg}}>JMBG</th>
                <th style={{width:columnWidths.fullName}}>Prezime i ime</th>
                <th style={{width:columnWidths.relationName}}>Relacija</th>
                <th style={{width:columnWidths.relationPrice}}>Cena</th>
                <th style={{width:columnWidths.days}}>Dana</th>
                <th style={{width:columnWidths.sumPerEmployee}}>Ukupno</th>
                <th style={{width:columnWidths.nonTaxablePrice}}>Neopor.</th>
                <th style={{width:columnWidths.taxablePrice}}>Opor.</th>
                <th style={{ textAlign: 'center',width:columnWidths.actions }}>
                  <Button
                    onClick={openAddEmployeeDialog}
                    title="Dodaj zaposlenog"
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
                          employeeWithRelations={employeeWithRelation}
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
      <AddEmployeeModal />
      <AddRelationWithDaysModal year={store.year} month={store.month}/>
    </Container>
  );
}
