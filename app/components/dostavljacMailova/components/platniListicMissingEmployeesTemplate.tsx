import React, { useState } from 'react';
import { Row, Col, Table, Button, ProgressBar } from 'react-bootstrap';
import { ExtractedEmployeeWithPageNumbers } from '../../../services/pdfParser/pdfParser.types';
import { createEmployee as insertEmployee } from '../../employees/employee.service';
import { handleResponse } from '../../../utils/responseHandler';
import { SUCCESS } from '../../../constants/responseStatuses';
import { useHistory } from 'react-router';
import routes from '../../../constants/routes.json';
import { PodaciOSlanjuZaIzborZaposlenih } from '../dostavljacMailova.types';

type Props = {
  missingEmployees: ExtractedEmployeeWithPageNumbers[];
  filePath: string;
  setInitialState: () => void;
  zaposleniUFajlu: ExtractedEmployeeWithPageNumbers[];
};

export default function PlatniListicTemplate(props: Props) {
  const {
    missingEmployees,
    setInitialState,
    filePath,
    zaposleniUFajlu
  } = props;
  const [insertingEmployees, setInsertingEmployees] = useState(false);
  const [progressBarValue, setProgressBarValue] = useState(0);
  const progressBarStep = 100 / missingEmployees.length;
  const history = useHistory();

  const insertNewEmployees = async () => {
    try {
      setInsertingEmployees(true);
      await missingEmployees.forEach(async (missingEmployee, i) => {
        handleResponse(
          await insertEmployee({
            ...missingEmployee,
            municipality_id: -1,
            active: true,
            id: -1,
            email: ''
          }),
          (res: any) => {
            if (res.status == SUCCESS) {
              setProgressBarValue((i + 1) * progressBarStep);
              if (i + 1 == missingEmployees.length)
                history.push({
                  pathname: routes.DOSTAVLJAC_MAILOVA_IZBOR_ZAPOSLENIH,
                  state: {
                    filePath,
                    zaposleniUFajlu
                  } as PodaciOSlanjuZaIzborZaposlenih
                });
            }
          }
        );
      });
    } catch (e) {
      setInsertingEmployees(false);
      setProgressBarValue(0);
    }
  };
  return (
    <>
      <h5>Sledeći zaposleni će biti upisani u bazu:</h5>
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
                  <th>JMBG</th>
                  <th>Broj zaposlenog</th>
                  <th>Prezime</th>
                  <th>Ime</th>
                  <th>Broj računa</th>
                </tr>
              </thead>
              <tbody>
                {missingEmployees.map(e => {
                  return (
                    <tr key={e.jmbg}>
                      <td>{e.jmbg}</td>
                      <td>{e.number}</td>
                      <td>{e.last_name}</td>
                      <td>{e.first_name}</td>
                      <td>{e.banc_account}</td>
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
          Njima neće biti upisane email adrese, pa im neće biti poslati
          mail-ovi. Ukoliko želite da im prvo definišete email adrese:
          <br />
          1) Odustanite od slanja. <br />
          2) Upišite im mail adrese (kartica -{' '}
          <span>
            <i className="fa fa-users" />
          </span>
          Zaposleni )<br />
          3) Ponovite proces slanja.
        </Col>
      </Row>
      {insertingEmployees ? (
        <Row>
          <Col>
            <ProgressBar variant="success" now={progressBarValue} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <div
              style={{
                paddingTop: 10,
                textAlign: 'center'
              }}
            >
              <Button
                style={{ marginRight: 5 }}
                onClick={() => setInitialState()}
              >
                Odustani
              </Button>
              <Button onClick={insertNewEmployees}>Nastavi</Button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
