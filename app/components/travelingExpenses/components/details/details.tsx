import React, { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import routes from '../../../../constants/routes.json';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import {
  loadTravelingExpenseDetails,
  _loadTravelingExpenseDetails,
  reloadCurrentTravelingExpenseDetails
} from './details.actions';
import getMonthName from '../../../../utils/getMonthName';
import {
  EmployeeWithRelations,
  EmployeeTravelingExpenseCalculator
} from '../../travelingExpenses.types';
import OneRelationTemplate from './components/relationTemplates/oneRelationTemplate';
import NoRelationTemplate from './components/relationTemplates/noRelationTemplate';
import MultipleRelationsTemplate from './components/relationTemplates/mulitpleRelationsTemplate';
import EditDaysModal from './components/editDaysModal/editDaysModal';
import { open } from './components/addEmployeeModal/addEmployeeModal.actions';
import AddEmployeeModal from './components/addEmployeeModal/addEmployeeModal';
import AddRelationWithDaysModal from './components/addRelationWithDaysModal/addRelationWithDaysModal';
import { initialState } from './details.reducer';
import { columnWidths, columColors } from './details.columnStyles';
import {
  create_PPP_PD_XML_File,
  createPdfFile,
  createVirmaniPdfFile
} from '../../travelingExpenses.fileCreators';
import { GET_PUTNI_TROSKOVI_PPP_PD_DIR } from '../../../../constants/files';
import { U_RADU, ZAVRSEN } from '../../../../constants/statuses';
import { numberWithThousandSeparator } from '../../../../utils/numberWithThousandSeparator';
import { areYouSure } from '../../../../utils/yesNoModal';
import { handleResponse } from '../../../../utils/responseHandler';
import * as service from '../../travelingExpenses.service';
import styles from './details.css';
import { get as getUserDetails } from '../../../userDetails/userDetails.service';
var remote = require('electron').remote;
var fs = remote.require('fs');

export default function Details() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  useEffect(() => {
    dispatch(loadTravelingExpenseDetails(id));

    return function() {
      dispatch(_loadTravelingExpenseDetails(initialState));
    };
  }, []);

  let hasEmployeesWithoutMunicipality =
    store.employees_with_relation.filter(employeeWithRelation => {
      return employeeWithRelation.employee.municipality == null;
    }).length > 0;

  let netoTotal = 0;
  let neoporeziviDeoTotal = 0;
  let oporeziviDeoTotal = 0;
  let brutoOporeziviDeoTotal = 0;
  let porezTotal = 0;

  store.employees_with_relation.forEach(
    (employeeWithRelation: EmployeeWithRelations) => {
      let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
        store.year,
        store.month,
        store.maxNonTaxedValue,
        store.preracun_na_bruto,
        store.stopa
      );
      let calculation = employeeTravelingExpenseCalculator.getCalculation(
        employeeWithRelation
      );
      netoTotal += calculation.neto;
      neoporeziviDeoTotal += calculation.neoporezivo;
      oporeziviDeoTotal += calculation.oporezivo;
      brutoOporeziviDeoTotal += calculation.brutoOporezivo;
      porezTotal += calculation.porez;
    }
  );

  const createXml = async () => {
    handleResponse(await getUserDetails(), (res: any) => {
      create_PPP_PD_XML_File(store.year, store.month, store, res.data);
      forceUpdate();
    });
  };

  const createPdf = async () => {
    handleResponse(await getUserDetails(), (res: any) => {
      createPdfFile(store.year, store.month, store, res.data);
      forceUpdate();
    });
  };

  const kreirajNalogeZaPlacanje = async () => {
    handleResponse(await getUserDetails(), (res: any) => {
      createVirmaniPdfFile(store.year, store.month, store, res.data);
      // forceUpdate();
    });
  };
  kreirajNalogeZaPlacanje();

  const openFolder = () => {
    const { shell } = require('electron');
    shell.openItem(GET_PUTNI_TROSKOVI_PPP_PD_DIR(store.year, store.month));
  };
  const zakljucaj = () => {
    areYouSure({
      title: 'Zaključavanje obračuna',
      message:
        'Da li ste sigurni da želite da zaključate obračun?\nUkoliko postoje zaposleni u obačunu za koje nije uneta nijedna relacija, oni će automatski biti uklonjeni iz obračuna.',
      onYes: async () => {
        handleResponse(await service.lockService(store.id), () => {
          dispatch(reloadCurrentTravelingExpenseDetails());
        });
      }
    });
  };

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <Container fluid className={`${styles['details-container']} noselect`}>
      <Row style={{ flexShrink: 0, backgroundColor: '#d8eacd' }}>
        <Col md={1} style={{ float: 'right', paddingLeft: 0 }}>
          <NavLink to={{ pathname: routes.TRAVEL_EXPENSES }}>
            <Button style={{ paddingTop: 2, paddingBottom: 2 }}>
              <i className="fa fa-chevron-left" />
            </Button>
          </NavLink>
        </Col>

        <Col md={11}>
          <b>
            Obračun putnih troškova za {getMonthName(store.month)} /{' '}
            {store.year}.
          </b>
          <div style={{ float: 'right' }}>
            {store.status == U_RADU.value ? (
              <Button
                variant="success"
                title={
                  hasEmployeesWithoutMunicipality
                    ? 'Nemaju svi zaposleni definisanu opštinu stanovanja!'
                    : 'Završi obračun'
                }
                disabled={hasEmployeesWithoutMunicipality}
                onClick={zakljucaj}
                className={styles['details-header-btn']}
              >
                <i className="fa fa-lock" />
              </Button>
            ) : store.status == ZAVRSEN.value ? (
              <>
                <Button
                  variant="success"
                  title={'Kreiraj pdf fajl.'}
                  onClick={createPdf}
                  className={styles['details-header-btn']}
                >
                  <i className="fa fa-file-pdf" />
                </Button>
                <Button
                  variant="success"
                  title={
                    hasEmployeesWithoutMunicipality
                      ? 'Nemaju svi zaposleni definisanu opštinu stanovanja!'
                      : 'kreiraj pd prijavu'
                  }
                  disabled={hasEmployeesWithoutMunicipality}
                  onClick={createXml}
                  className={styles['details-header-btn']}
                >
                  <i className="fa fa-file-code" />
                </Button>
                <Button
                  variant="success"
                  title={
                    hasEmployeesWithoutMunicipality
                      ? 'Nemaju svi zaposleni definisanu opštinu stanovanja!'
                      : 'kreiraj naloge za prenos'
                  }
                  onClick={kreirajNalogeZaPlacanje}
                  className={styles['details-header-btn']}
                >
                  <i className="fa fa-file" />
                </Button>
                <Button
                  variant="success"
                  title="otvori folder"
                  disabled={
                    !fs.existsSync(
                      GET_PUTNI_TROSKOVI_PPP_PD_DIR(store.year, store.month)
                    )
                  }
                  onClick={openFolder}
                  className={styles['details-header-btn']}
                >
                  <i className="fa fa-folder-open" />
                </Button>
              </>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row style={{ flexGrow: 1, overflow: 'auto' }}>
        <Col style={{ padding: 0 }}>
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{
              width:
                store.status == U_RADU.value
                  ? columnWidths.sum()
                  : columnWidths.sum() - columnWidths.actions
            }}
          >
            <thead>
              <tr>
                <th style={{ width: columnWidths.jmbg }}>JMBG</th>
                <th style={{ width: columnWidths.fullName }}>Prezime i ime</th>
                <th style={{ width: columnWidths.relationName }}>Relacija</th>
                <th style={{ width: columnWidths.relationPrice }}>Cena</th>
                <th style={{ width: columnWidths.days }}>Dana</th>
                <th style={{ width: columnWidths.sumPerEmployee }}>Neto</th>
                <th style={{ width: columnWidths.nonTaxablePrice }}>
                  Neoporez.
                </th>
                <th style={{ width: columnWidths.taxablePrice }}>Oporez.</th>
                <th style={{ width: columnWidths.brutoTaxable }}>
                  Bruto Opor.
                </th>
                <th style={{ width: columnWidths.tax }}>Porez</th>
                {store.status == U_RADU.value ? (
                  <th
                    style={{ textAlign: 'center', width: columnWidths.actions }}
                  >
                    <Button
                      onClick={() => dispatch(open(store.id))}
                      title="Dodaj zaposlenog"
                      variant="success"
                      className="table-header-btn"
                    >
                      <i className="fa fa-plus" />
                    </Button>
                  </th>
                ) : null}
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
          backgroundColor: '#d8eacd',
          flexShrink: 0
        }}
      >
        <div
          style={{
            backgroundColor: columColors.sumPerEmployee
          }}
          className={styles['details-total']}
        >
          neto: {numberWithThousandSeparator(netoTotal)}
        </div>
        <div
          style={{
            backgroundColor: columColors.nonTaxablePrice
          }}
          className={styles['details-total']}
        >
          neoporezivo: {numberWithThousandSeparator(neoporeziviDeoTotal)}
        </div>
        <div
          style={{
            backgroundColor: columColors.taxablePrice
          }}
          className={styles['details-total']}
        >
          oporezivo: {numberWithThousandSeparator(oporeziviDeoTotal)}
        </div>

        <div
          style={{ backgroundColor: columColors.brutoTaxable }}
          className={styles['details-total']}
        >
          Bruto oporezivo: {numberWithThousandSeparator(brutoOporeziviDeoTotal)}
        </div>
        <div
          style={{ backgroundColor: columColors.tax }}
          className={styles['details-total']}
        >
          Porez: {numberWithThousandSeparator(porezTotal)}
        </div>
      </Row>
      <EditDaysModal year={store.year} month={store.month} />
      <AddEmployeeModal />
      <AddRelationWithDaysModal year={store.year} month={store.month} />
    </Container>
  );
}
