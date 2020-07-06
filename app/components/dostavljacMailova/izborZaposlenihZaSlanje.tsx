import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { PodaciOSlanju } from './dostavljacMailova.types';
import { get as getAllEmployees } from '../employees/employee.service';
import { Employee } from '../employees/types';
import { handleResponse } from '../../utils/responseHandler';
import { Row, Col, Table, Button, Container } from 'react-bootstrap';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { useHistory } from 'react-router-dom';
import routes from '../../constants/routes.json';
function isValidEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function IzborZaposlenihZaSlanje() {
  const history = useHistory();
  const state = useLocation().state as PodaciOSlanju;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [fileSubject, setFileSubject] = useState('');
  useEffect(() => {
    async function getUserEmployees() {
      handleResponse(await getAllEmployees(), (res: any) => {
        let zaposleniSaValidnimEmailom = res.data.filter((x: Employee) =>
          isValidEmail(x.email)
        );

        let zaposleniSaValidnimEmailomKojiPostojeUFajlu = zaposleniSaValidnimEmailom.filter(
          (x: Employee) =>
            state.zaposleniUFajlu.filter(z => z.number == x.number).length > 0
        );
        setEmployees(zaposleniSaValidnimEmailomKojiPostojeUFajlu);
      });
    }

    async function getFileSubject() {
      let pdfDataExtractor = new PdfDataExtractor();
      setFileSubject(await pdfDataExtractor.subject(state.filePath));
    }

    getUserEmployees();
    getFileSubject();
  }, []);

  return (
    <Container>
      <Row>
        <Col md={11}>
          <div>
            putanja fajla : <b>{state.filePath}</b>
          </div>
        </Col>
        <Col md={1}>
          <Button
            variant="warning"
            style={{ padding: '0 5px' }}
            onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA)}
          >
            <i className="fa fa-edit" />
          </Button>
        </Col>
      </Row>

      <h4>{fileSubject}</h4>
      <h6>Izaberite zaposlene za slanje:</h6>
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
                {employees.map(e => {
                  return (
                    <tr key={e.jmbg} onClick={() => console.log('asd')}>
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
          <div
            style={{
              paddingTop: 10,
              textAlign: 'center'
            }}
          >
            <Button
              style={{ marginRight: 5 }}
              onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA)}
            >
              Odustani
            </Button>
            <Button>Nastavi</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
