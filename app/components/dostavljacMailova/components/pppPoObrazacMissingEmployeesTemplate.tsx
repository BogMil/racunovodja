import React from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { ExtractedEmployeeWithPageNumbers } from '../../../services/pdfParser/pdfParser.types';
import routes from '../../../constants/routes.json';
import { useHistory } from 'react-router';
import { PodaciOSlanjuZaIzborZaposlenih } from '../dostavljacMailova.types';

type Props = {
  missingEmployees: ExtractedEmployeeWithPageNumbers[];
  filePath: string;
  setInitialState: () => void;
  zaposleniUFajlu: ExtractedEmployeeWithPageNumbers[];
};

export default function PppPoObrazacMissingEmployeesTemplate(props: Props) {
  const {
    missingEmployees,
    setInitialState,
    filePath,
    zaposleniUFajlu
  } = props;

  const history = useHistory();

  const nastavi = () => {
    history.push({
      pathname: routes.DOSTAVLJAC_MAILOVA_IZBOR_ZAPOSLENIH,
      state: {
        filePath,
        zaposleniUFajlu
      } as PodaciOSlanjuZaIzborZaposlenih
    });
  };
  return (
    <>
      <h5>
        U bazi nedostaju zaposleni sa jmbg-ovima koji se nalaze na određenim
        stranicama.
      </h5>
      <Row>
        <Col>
          <div
            style={{
              maxHeight: 400,
              border: '1px solid black',
              overflowY: 'auto',
              overflowX: 'auto'
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>JMBG</th>
                  <th>Broj stranice</th>
                </tr>
              </thead>
              <tbody>
                {missingEmployees.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{e.jmbg}</td>
                      <td>{e.pageNumbers[0]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          Možete da ih upišete u bazu na kartici -{' '}
          <span>
            <i className="fa fa-users" />
          </span>
          Zaposleni - učitavanjem iz platnog listića ili ručnim unosom.
          <div style={{ color: 'red' }}>
            Ukoliko nastavite sa slanjem, gore navedene stranice neće biti
            poslate.
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div
            style={{
              paddingTop: 10,
              textAlign: 'center'
            }}
          >
            <Button style={{ marginRight: 5 }} onClick={setInitialState}>
              Odustani
            </Button>
            {missingEmployees.length == zaposleniUFajlu.length ? (
              <>
                <div>
                  Ne postoji nijedan zaposleni koji se istovremeno nalazi u
                  fajlu i u bazi.
                </div>
              </>
            ) : (
              <Button style={{ marginRight: 5 }} onClick={nastavi}>
                Nastavi
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
}
