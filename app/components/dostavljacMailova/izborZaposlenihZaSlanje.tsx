import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import {
  PodaciOSlanjuZaIzborZaposlenih,
  PodaciOSlanjuZaSlanje,
  DbEmployeeWithPages
} from './dostavljacMailova.types';
import { get as getAllEmployees } from '../zaposleni/zaposleni.service';
import { Zaposleni } from '../zaposleni/zaposleni.types';
import { handleResponse } from '../../utils/responseHandler';
import { Row, Col, Table, Button, Container, Form } from 'react-bootstrap';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { useHistory } from 'react-router-dom';
import routes from '../../constants/routes.json';
import { ExtractedEmployeeWithPageNumbers } from '../../services/pdfParser/pdfParser.types';
function isValidEmail(email: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function IzborZaposlenihZaSlanje() {
  const history = useHistory();
  try {
    const state = useLocation().state as PodaciOSlanjuZaIzborZaposlenih;

    const [employees, setEmployees] = useState<Zaposleni[]>([]);
    const [
      brojeviCekiranihZaposlenih,
      setBrojeviCekiranihZaposlenih
    ] = useState<string[]>([]);
    const [
      jmbgoviCekiranihZaposlenih,
      setJmbgoviCekiranihZaposlenih
    ] = useState<string[]>([]);
    const [fileSubject, setFileSubject] = useState('');
    const [fileType, setFileType] = useState('');
    const [godina, setGodina] = useState('');
    const [nazivSkoleIzFajla, setNazivSkoleIzFajla] = useState('');
    const [izaberiSve, setIzaberiSve] = useState(true);

    const zaposleniNemajuSifre = zapNemajuSifre(state.zaposleniUFajlu);
    useEffect(() => {
      async function getUserEmployees() {
        handleResponse(await getAllEmployees(), (res: any) => {
          let zaposleniSaValidnimEmailom = res.data.filter(
            (x: Zaposleni) => isValidEmail(x.email1) || isValidEmail(x.email2)
          );
          let zaposleniSaValidnimEmailomKojiPostojeUFajlu = zaposleniNemajuSifre
            ? zaposleniSaValidnimEmailom.filter(
                (x: Zaposleni) =>
                  state.zaposleniUFajlu.filter(z => z.jmbg == x.jmbg).length > 0
              )
            : zaposleniSaValidnimEmailom.filter(
                (x: Zaposleni) =>
                  state.zaposleniUFajlu.filter(z => z.sifra == x.sifra).length >
                  0
              );
          console.log(zaposleniSaValidnimEmailomKojiPostojeUFajlu);
          setEmployees(zaposleniSaValidnimEmailomKojiPostojeUFajlu);
          if (zaposleniNemajuSifre)
            setJmbgoviCekiranihZaposlenih(
              zaposleniSaValidnimEmailomKojiPostojeUFajlu.map(
                (x: Zaposleni) => x.jmbg
              )
            );
          else
            setBrojeviCekiranihZaposlenih(
              zaposleniSaValidnimEmailomKojiPostojeUFajlu.map(
                (x: Zaposleni) => x.sifra
              )
            );
        });
      }

      async function getFileSubject() {
        let pdfDataExtractor = new PdfDataExtractor();
        setFileSubject(await pdfDataExtractor.subjectAsync(state.filePath));
      }

      async function getFileType() {
        let pdfDataExtractor = new PdfDataExtractor();
        setFileType(await pdfDataExtractor.fileTypeAsync(state.filePath));
      }

      async function getYear() {
        let pdfDataExtractor = new PdfDataExtractor();
        setGodina(await pdfDataExtractor.yearAsync(state.filePath));
      }

      async function getNazivSkoleIzFajla() {
        let pdfDataExtractor = new PdfDataExtractor();
        setNazivSkoleIzFajla(
          await pdfDataExtractor.nazivSkoleAsync(state.filePath)
        );
      }

      getNazivSkoleIzFajla();
      getYear();
      getUserEmployees();
      getFileSubject();
      getFileType();
    }, []);

    function zapNemajuSifre(
      extractedEmployees: ExtractedEmployeeWithPageNumbers[]
    ) {
      let numbers = extractedEmployees.map(e => e.sifra);
      let jedinstveneSifre = numbers.filter(onlyUnique);

      return jedinstveneSifre.length == 1 && jedinstveneSifre[0] == '';

      function onlyUnique(value: any, index: any, self: any) {
        return self.indexOf(value) === index;
      }
    }

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

    const cekirajZaposlenogSaJmbgom = (jmbg: string) => {
      let _jmbgoviCekiranihZaposlenih = jmbgoviCekiranihZaposlenih.map(x => x);
      let cekiraniZaposleni = _jmbgoviCekiranihZaposlenih.filter(
        x => x == jmbg
      );
      if (cekiraniZaposleni.length == 0)
        setJmbgoviCekiranihZaposlenih([jmbg, ..._jmbgoviCekiranihZaposlenih]);
      else {
        _jmbgoviCekiranihZaposlenih = _jmbgoviCekiranihZaposlenih.filter(
          x => x != jmbg
        );
        setJmbgoviCekiranihZaposlenih(_jmbgoviCekiranihZaposlenih);
      }
    };

    const onIzaberiSve = () => {
      let newVal = !izaberiSve;
      setIzaberiSve(newVal);
      if (newVal == false) {
        setBrojeviCekiranihZaposlenih([]);
        setJmbgoviCekiranihZaposlenih([]);
      } else {
        if (zaposleniNemajuSifre)
          setJmbgoviCekiranihZaposlenih(employees.map(x => x.jmbg));
        else setBrojeviCekiranihZaposlenih(employees.map(x => x.sifra));
      }
    };

    const onNastavi = () => {
      let odabraniZaposleni = employees.filter(x => {
        if (zaposleniNemajuSifre)
          return jmbgoviCekiranihZaposlenih.includes(x.jmbg);
        else return brojeviCekiranihZaposlenih.includes(x.sifra);
      });
      let zaposleniSaStranicama = odabraniZaposleni.map(zaposleni => {
        let pageNumbers = state.zaposleniUFajlu.filter(x => {
          if (zaposleniNemajuSifre) return x.jmbg == zaposleni.jmbg;
          else return x.sifra == zaposleni.sifra;
        })[0].pageNumbers;

        return {
          dbEmployee: zaposleni,
          pageNumbers
        } as DbEmployeeWithPages;
      });

      history.push({
        pathname: routes.DOSTAVLJAC_MAILOVA_SLANJE,
        state: {
          filePath: state.filePath,
          odabraniZaposleni: zaposleniSaStranicama,
          fileSubject,
          fileType,
          godina,
          nazivSkoleIzFajla
        } as PodaciOSlanjuZaSlanje
      });
    };

    return (
      <Container className="noselect">
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
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e, i) => {
                    return (
                      <tr
                        key={i}
                        onClick={() => {
                          zaposleniNemajuSifre
                            ? cekirajZaposlenogSaJmbgom(e.jmbg)
                            : cekirajZaposlenogSaSifrom(e.sifra);
                        }}
                        style={{
                          backgroundColor: zaposleniNemajuSifre
                            ? jmbgoviCekiranihZaposlenih.filter(
                                x => x == e.jmbg
                              ).length > 0
                              ? '#a8be8f'
                              : ''
                            : brojeviCekiranihZaposlenih.filter(
                                x => x == e.sifra
                              ).length > 0
                            ? '#a8be8f'
                            : ''
                        }}
                      >
                        <td>{e.jmbg}</td>
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
          <Col>
            Izabrano{' '}
            {zaposleniNemajuSifre
              ? jmbgoviCekiranihZaposlenih.length
              : brojeviCekiranihZaposlenih.length}{' '}
            zaposlenih
          </Col>
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
                onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA)}
              >
                Odustani
              </Button>
              <Button
                disabled={
                  zaposleniNemajuSifre
                    ? jmbgoviCekiranihZaposlenih.length == 0
                    : brojeviCekiranihZaposlenih.length == 0
                }
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
    history.push(routes.DOSTAVLJAC_MAILOVA);
    return null;
  }
}
