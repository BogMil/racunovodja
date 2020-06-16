import React, { useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPlus,
  faFileCode,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
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
  RelationWithDays
} from '../../travelingExpenses.types';
import OneRelationTemplate from './components/relationTemplates/oneRelationTemplate';
import NoRelationTemplate from './components/relationTemplates/noRelationTemplate';
import MultipleRelationsTemplate from './components/relationTemplates/mulitpleRelationsTemplate';
import EditDaysModal from './components/editDaysModal/editDaysModal';
import { open } from './components/addEmployeeModal/addEmployeeModal.actions';
import AddEmployeeModal from './components/addEmployeeModal/addEmployeeModal';
import AddRelationWithDaysModal from './components/addRelationWithDaysModal/addRelationWithDaysModal';
import { initialState } from './details.reducer';
import { columnWidths } from './details.columnStyles';
import { create_PPP_PD_File } from '../../travelingExpenses.fileCreators';
import { GET_PUTNI_TROSKOVI_PPP_PD_DIR } from '../../../../constants/files';
import { U_RADU } from '../../../../constants/statuses';
import { calculateNonTaxedValue } from './components/relationTemplates/calculateNonTaxedValue';
import { numberWithThousandSeparator } from '../../../../utils/numberWithThousandSeparator';
import { areYouSure } from '../../../../utils/yesNoModal';
import { handleResponse } from '../../../../utils/responseHandler';
import * as service from '../../travelingExpenses.service';

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

  const openAddEmployeeDialog = async () => {
    dispatch(open(store.id));
  };

  let totalSum = 0;
  let nonTaxedSum = 0;
  let taxedSum = 0;
  store.employees_with_relation.forEach(
    (employeeWithRelation: EmployeeWithRelations) => {
      if (employeeWithRelation.relations_with_days.length <= 0) return;

      if (employeeWithRelation.relations_with_days.length == 1) {
        let relationWithDays = employeeWithRelation.relations_with_days[0];
        let sum = relationWithDays.days * relationWithDays.relation.price;
        totalSum += sum;

        let neoporezivo = calculateNonTaxedValue(
          relationWithDays.days,
          store.maxNonTaxedValue,
          store.year,
          store.month,
          sum
        );
        let oporezivo = sum - neoporezivo;

        nonTaxedSum += neoporezivo;
        taxedSum += oporezivo;

        return;
      }

      if (employeeWithRelation.relations_with_days.length > 1) {
        let sum = 0;
        let days = 0;
        employeeWithRelation.relations_with_days.forEach(
          (relationWithDays: RelationWithDays) => {
            sum += relationWithDays.days * relationWithDays.relation.price;
            days += relationWithDays.days;
            return;
          }
        );
        totalSum += sum;

        let neoporezivo = calculateNonTaxedValue(
          days,
          store.maxNonTaxedValue,
          store.year,
          store.month,
          sum
        );
        let oporezivo = sum - neoporezivo;

        nonTaxedSum += neoporezivo;
        taxedSum += oporezivo;
      }
    }
  );

  const createXml = () => {
    const { shell } = require('electron');

    var builder = require('xmlbuilder');

    var xml = builder.create('tns:PodaciPoreskeDeklaracije');
    xml.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    xml.att('xmlns:tns', 'http://pid.purs.gov.rs');
    xml.att('xsi:schemaLocation', 'http://pid.purs.gov.rs');

    let PodaciOPrijavi = xml.ele('tns:PodaciOPrijavi');
    PodaciOPrijavi.ele('tns:KlijentskaOznakaDeklaracije', 1);
    PodaciOPrijavi.ele('tns:VrstaPrijave', 1);
    PodaciOPrijavi.ele('tns:ObracunskiPeriod', '2020-05');
    PodaciOPrijavi.ele('tns:DatumPlacanja', '2020-06-10');
    PodaciOPrijavi.ele('tns:NajnizaOsnovica', 0);

    let PodaciOIsplatiocu = xml.ele('tns:PodaciOIsplatiocu');
    PodaciOIsplatiocu.ele('tns:TipIsplatioca', 2);
    PodaciOIsplatiocu.ele('tns:PoreskiIdentifikacioniBroj', 101408574);
    PodaciOIsplatiocu.ele('tns:BrojZaposlenih', 2);
    PodaciOIsplatiocu.ele('tns:MaticniBrojisplatioca', '0825740');
    PodaciOIsplatiocu.ele('tns:NazivPrezimeIme', 'SSŠ Vasa Pelagić');
    PodaciOIsplatiocu.ele('tns:SedistePrebivaliste', 217);
    PodaciOIsplatiocu.ele('tns:Telefon', '013 742 200');
    PodaciOIsplatiocu.ele('tns:UlicaIBroj', 'Cara Lazara 261');
    PodaciOIsplatiocu.ele('tns:eMail', 'vpkovin@gmail.com');

    let DeklarisaniPrihodi = xml.ele('tns:DeklarisaniPrihodi');
    let PodaciOPrihodima1 = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');

    PodaciOPrihodima1.ele('tns:RedniBroj', 1);
    PodaciOPrihodima1.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima1.ele('tns:IdentifikatorPrimaoca', '0204986865068');
    PodaciOPrihodima1.ele('tns:Prezime', 'Kosovac');
    PodaciOPrihodima1.ele('tns:Ime', 'Katarina');
    PodaciOPrihodima1.ele('tns:OznakaPrebivalista', 217);
    PodaciOPrihodima1.ele('tns:SVP', 105602000);
    PodaciOPrihodima1.ele('tns:MesecniFondSati', 168);
    PodaciOPrihodima1.ele('tns:Bruto', 3378.0);
    PodaciOPrihodima1.ele('tns:OsnovicaPorez', 3378.0);
    PodaciOPrihodima1.ele('tns:Porez', 338.0);
    PodaciOPrihodima1.ele('tns:OsnovicaDoprinosi', '0.0');
    PodaciOPrihodima1.ele('tns:PIO', '0.0');
    PodaciOPrihodima1.ele('tns:ZDR', '0.0');
    PodaciOPrihodima1.ele('tns:NEZ', '0.0');
    PodaciOPrihodima1.ele('tns:PIOBen', '0.0');
    PodaciOPrihodima1.ele('tns:DeklarisaniMFP');

    let PodaciOPrihodima2 = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');

    PodaciOPrihodima2.ele('tns:RedniBroj', 2);
    PodaciOPrihodima2.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima2.ele('tns:IdentifikatorPrimaoca', 1705991862517);
    PodaciOPrihodima2.ele('tns:Prezime', 'Čolaković');
    PodaciOPrihodima2.ele('tns:Ime', 'Dušan');
    PodaciOPrihodima2.ele('tns:OznakaPrebivalista', '022');
    PodaciOPrihodima2.ele('tns:SVP', 101110000);
    PodaciOPrihodima2.ele('tns:MesecniFondSati', 168);
    PodaciOPrihodima2.ele('tns:Bruto', 2489);
    PodaciOPrihodima2.ele('tns:OsnovicaPorez', 2489);
    PodaciOPrihodima2.ele('tns:Porez', 249);
    PodaciOPrihodima2.ele('tns:OsnovicaDoprinosi', 0);
    PodaciOPrihodima2.ele('tns:PIO', 0);
    PodaciOPrihodima2.ele('tns:ZDR', 0);
    PodaciOPrihodima2.ele('tns:NEZ', 0);
    PodaciOPrihodima2.ele('tns:PIOBen', 0);
    PodaciOPrihodima2.ele('tns:DeklarisaniMFP');

    let doc = xml.end({ pretty: true });

    create_PPP_PD_File(store.year, store.month, doc);
    shell.openItem(GET_PUTNI_TROSKOVI_PPP_PD_DIR(store.year, store.month));
  };

  const finish = () => {
    areYouSure({
      title: 'Zaključavanje obračuna',
      message:
        'Da li ste sigurni da želite da zaključate obračun?\nUkoliko postoje zaposleni u obačunu za koje nije uneta ni jedna relacija, oni će automatski biti uklonjeni iz obračuna.',
      onYes: async () => {
        handleResponse(await service.lockService(store.id), () => {
          dispatch(reloadCurrentTravelingExpenseDetails());
        });
      }
    });
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
          backgroundColor: '#d8eacd'
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
          <div style={{ float: 'right' }}>
            {store.status == U_RADU.value ? (
              <Button
                variant="success"
                title="Završi"
                onClick={finish}
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 5,
                  paddingRight: 5,
                  height: 25,
                  marginLeft: 5
                }}
              >
                <FontAwesomeIcon icon={faCheckDouble} />{' '}
              </Button>
            ) : (
              <Button
                variant="success"
                title="kreiraj pd prijavu"
                onClick={createXml}
                style={{
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 5,
                  paddingRight: 5,
                  height: 25,
                  marginLeft: 5
                }}
              >
                <FontAwesomeIcon icon={faFileCode} />{' '}
              </Button>
            )}
          </div>
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
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{ width: columnWidths.sum() }}
          >
            <thead>
              <tr>
                <th style={{ width: columnWidths.jmbg }}>JMBG</th>
                <th style={{ width: columnWidths.fullName }}>Prezime i ime</th>
                <th style={{ width: columnWidths.relationName }}>Relacija</th>
                <th style={{ width: columnWidths.relationPrice }}>Cena</th>
                <th style={{ width: columnWidths.days }}>Dana</th>
                <th style={{ width: columnWidths.sumPerEmployee }}>Neto</th>
                <th style={{ width: columnWidths.nonTaxablePrice }}>Neopor.</th>
                <th style={{ width: columnWidths.taxablePrice }}>Opor.</th>
                <th style={{ width: columnWidths.brutoTaxable }}>Bruto O.</th>
                <th style={{ width: columnWidths.tax }}>Porez</th>
                <th
                  style={{ textAlign: 'center', width: columnWidths.actions }}
                >
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
          <Row>
            <Col>Ukupno : {numberWithThousandSeparator(totalSum)}</Col>
            <Col>
              Ukupno oporezivo : {numberWithThousandSeparator(taxedSum)}
            </Col>
            <Col>
              Ukupno neoporezivo: {numberWithThousandSeparator(nonTaxedSum)}
            </Col>
          </Row>
        </Col>
      </Row>
      <EditDaysModal year={store.year} month={store.month} />
      <AddEmployeeModal />
      <AddRelationWithDaysModal year={store.year} month={store.month} />
    </Container>
  );
}
