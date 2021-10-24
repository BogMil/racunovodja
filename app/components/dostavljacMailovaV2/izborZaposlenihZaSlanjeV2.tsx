import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { get as getAllEmployees } from '../zaposleni/zaposleni.service';
import { Zaposleni } from '../zaposleni/zaposleni.types';
import { handleResponse } from '../../utils/responseHandler';
import { Row, Col, Table, Button, Container, Form } from 'react-bootstrap';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { useHistory } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { ZaposleniSaSifromIFajlom } from './dostavljacMailova.types';
function isValidEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function IzborZaposlenihZaSlanjeV2() {
  const history = useHistory();
  try {
    const state = useLocation().state as any;

    const [employees, setEmployees] = useState<Zaposleni[]>([]);
    const [
      brojeviCekiranihZaposlenih,
      setBrojeviCekiranihZaposlenih
    ] = useState<string[]>([]);

    const [fileSubject, setFileSubject] = useState('');
    const [fileType, setFileType] = useState('');
    const [godina, setGodina] = useState('');
    const [nazivSkoleIzFajla, setNazivSkoleIzFajla] = useState('');
    const [izaberiSve, setIzaberiSve] = useState(false);

    useEffect(() => {
      async function getUserEmployees() {
        handleResponse(await getAllEmployees(), (res: any) => {
          let zaposleniSaValidnimEmailom = res.data.filter(
            (x: Zaposleni) => isValidEmail(x.email1) || isValidEmail(x.email2)
          );
          let zaposleniSaValidnimEmailomKojiPostojeUFajlu = zaposleniSaValidnimEmailom.map(
            (x: Zaposleni) => {
              let zuf = state.zaposleniUFajlu.filter(
                (z: ZaposleniSaSifromIFajlom) =>
                  parseInt(z.sifra) === parseInt(x.sifra)
              )[0];

              if (zuf) return { ...x, fajl: zuf.fajl };
            }
          );

          setEmployees(
            zaposleniSaValidnimEmailomKojiPostojeUFajlu.filter(
              em => em != undefined
            )
          );
        });
      }

      const firstFolderPath = `${state.zaposleniUFajlu[0].fajl}`;
      async function getFileSubject() {
        let pdfDataExtractor = new PdfDataExtractor();
        setFileSubject(await pdfDataExtractor.subjectAsync(firstFolderPath));
      }

      async function getFileType() {
        let pdfDataExtractor = new PdfDataExtractor();
        setFileType(await pdfDataExtractor.fileTypeAsync(firstFolderPath));
      }

      async function getYear() {
        let pdfDataExtractor = new PdfDataExtractor();
        setGodina(await pdfDataExtractor.yearAsync(firstFolderPath));
      }

      async function getNazivSkoleIzFajla() {
        let pdfDataExtractor = new PdfDataExtractor();
        setNazivSkoleIzFajla(
          await pdfDataExtractor.nazivSkoleAsync(firstFolderPath)
        );
      }

      getNazivSkoleIzFajla();
      getYear();
      getUserEmployees();
      getFileSubject();
      getFileType();
    }, []);

    const cekirajZaposlenogSaSifrom = (number: string) => {
      let _brojeviCekiranihZaposlenih = brojeviCekiranihZaposlenih.map(x => x);
      let cekiraniZaposleni = _brojeviCekiranihZaposlenih.filter(
        x => x == number
      );
      if (cekiraniZaposleni.length == 0)
        setBrojeviCekiranihZaposlenih([number, ..._brojeviCekiranihZaposlenih]);
      else {
        _brojeviCekiranihZaposlenih = _brojeviCekiranihZaposlenih.filter(
          x => x != number
        );
        setBrojeviCekiranihZaposlenih(_brojeviCekiranihZaposlenih);
      }
    };

    const onIzaberiSve = () => {
      let newVal = !izaberiSve;
      setIzaberiSve(newVal);
      if (newVal == false) {
        setBrojeviCekiranihZaposlenih([]);
      } else {
        setBrojeviCekiranihZaposlenih(employees.map(x => x.sifra));
      }
    };

    const onNastavi = () => {
      let odabraniZaposleni = employees.filter(x => {
        return brojeviCekiranihZaposlenih.includes(x.sifra);
      });

      history.push({
        pathname: routes.DOSTAVLJAC_MAILOVA_SLANJE_V2,
        state: {
          filePath: state.filePath,
          odabraniZaposleni,
          fileSubject,
          fileType,
          godina,
          nazivSkoleIzFajla
        } as any
      });
    };

    console.log(employees);

    return (
      <Container className="noselect">
        <Row>
          <Col md={11}>
            <div>
              putanja foldera : <b>{state.filePath}</b>
            </div>
          </Col>
          <Col md={1}>
            <Button
              variant="warning"
              style={{ padding: '0 5px' }}
              onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA_V2)}
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
                    <th>Broj zaposlenog</th>
                    <th>Prezime</th>
                    <th>Ime</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => {
                    return (
                      <tr
                        key={i}
                        onClick={() => {
                          cekirajZaposlenogSaSifrom(e.sifra);
                        }}
                        style={{
                          backgroundColor:
                            brojeviCekiranihZaposlenih.filter(x => x == e.sifra)
                              .length > 0
                              ? '#a8be8f'
                              : ''
                        }}
                      >
                        <td>{e.sifra}</td>
                        <td>{e.prezime}</td>
                        <td>{e.ime}</td>
                        <td>
                          <div>{e.email1}</div>
                          <div>{e.email2}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>Izabrano {brojeviCekiranihZaposlenih.length} zaposlenih</Col>
          <Col>
            <div style={{ float: 'right' }}>
              <Form.Group>
                <Form.Check
                  id="izaberiSveChk"
                  type="checkbox"
                  label="Izaberi sve"
                  checked={izaberiSve}
                  onChange={onIzaberiSve}
                />
              </Form.Group>
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
                onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA_V2)}
              >
                Odustani
              </Button>
              <Button
                disabled={brojeviCekiranihZaposlenih.length == 0}
                onClick={onNastavi}
              >
                Nastavi
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  } catch (e) {
    console.log(e);
    history.push(routes.DOSTAVLJAC_MAILOVA_V2);
    return null;
  }
}
