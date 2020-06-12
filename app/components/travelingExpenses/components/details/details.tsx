import React, { useEffect } from 'react';
import { useParams, NavLink, useLocation } from 'react-router-dom';
import { Row, Col, Button, Container, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faPlus,
  faFileCode
} from '@fortawesome/free-solid-svg-icons';
import routes from '../../../../constants/routes.json';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import {
  loadTravelingExpenseDetails,
  _loadTravelingExpenseDetails
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
import { columnWidths } from './details.columnWidths';
import {
  create_PPP_PD_File,
  get_PPP_PD_FilePath
} from '../../travelingExpenses.fileCreators';
import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_FILE,
  GET_PUTNI_TROSKOVI_PPP_PD_DIR
} from '../../../../constants/files';

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

  const getTaxedPart = (sum: number) => {
    let _taxedSum = 0;

    if (sum <= store.maxNonTaxedValue) {
      _taxedSum = 0;
    } else if (sum > store.maxNonTaxedValue) {
      _taxedSum = sum - store.maxNonTaxedValue;
    }

    return _taxedSum;
  };

  const getNonTaxedPart = (sum: number) => {
    let _nonTaxedSum = 0;

    if (sum <= store.maxNonTaxedValue) {
      _nonTaxedSum = sum;
    } else if (sum > store.maxNonTaxedValue) {
      _nonTaxedSum = store.maxNonTaxedValue;
    }

    return _nonTaxedSum;
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

        nonTaxedSum += getNonTaxedPart(sum);
        taxedSum += getTaxedPart(sum);

        return;
      }

      if (employeeWithRelation.relations_with_days.length > 1) {
        let sum = 0;
        employeeWithRelation.relations_with_days.forEach(
          (relationWithDays: RelationWithDays) => {
            sum += relationWithDays.days * relationWithDays.relation.price;
            return;
          }
        );
        totalSum += sum;
        nonTaxedSum += getNonTaxedPart(sum);
        taxedSum += getTaxedPart(sum);
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
          <div style={{ float: 'right' }}>
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
                <th style={{ width: columnWidths.sumPerEmployee }}>Ukupno</th>
                <th style={{ width: columnWidths.nonTaxablePrice }}>Neopor.</th>
                <th style={{ width: columnWidths.taxablePrice }}>Opor.</th>
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
            <Col>Ukupno : {totalSum}</Col>
            <Col>Ukupno oporezivo : {taxedSum}</Col>
            <Col>Ukupno neoporezivo: {nonTaxedSum}</Col>
          </Row>
        </Col>
      </Row>
      <EditDaysModal year={store.year} month={store.month} />
      <AddEmployeeModal />
      <AddRelationWithDaysModal year={store.year} month={store.month} />
    </Container>
  );
}
