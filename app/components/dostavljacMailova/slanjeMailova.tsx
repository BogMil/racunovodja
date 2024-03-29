import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import {
  PodaciOSlanjuZaSlanje,
  RezultatSlanja
} from './dostavljacMailova.types';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import routes from '../../constants/routes.json';
import { SlanjeMailovaService, logSendingMail } from './slanjeMailova.service';
import { MailAuthException } from '../../services/mailSender/exceptions/mailAuthException';
import { NepredvidjenException } from '../../services/mailSender/exceptions/nepredvidjenException';
import { createPdfFile } from './dostavljacMailova.fileCreators';
import { get as getUserDetails } from '../detaljiKorisnika/detaljiKorisnika.service';
const { dialog, getCurrentWindow } = require('electron').remote;

export default function SlanjeMailovaComponent() {
  const history = useHistory();
  try {
    const {
      filePath,
      fileSubject,
      odabraniZaposleni,
      fileType,
      godina,
      nazivSkoleIzFajla
    } = useLocation().state as PodaciOSlanjuZaSlanje;

    const [sendingResults, setSendingResults] = useState<RezultatSlanja[]>([]);
    const [slanjeUToku, setSlanjeUToku] = useState(true);
    const [krajProcesa, setKrajProcesa] = useState<boolean>(false);
    const [uspesno, setUspesno] = useState(false);
    const [greska, setGreska] = useState('');

    useEffect(() => {
      posaljiMailoveAsync();
    }, []);

    useEffect(() => {
      if (krajProcesa)
        logSendingMail({
          uspesno: uspesno,
          subject: fileSubject,
          vrsta: fileType,
          greska: greska,
          naziv_skole_iz_fajla: nazivSkoleIzFajla,
          rezultat_slanja: JSON.stringify(sendingResults)
        });
    }, [krajProcesa]);

    const posaljiMailoveAsync = async () => {
      let rezultatiSlanjaTemp: RezultatSlanja[] = [];

      try {
        var userDetailsRes = await getUserDetails();
        if (userDetailsRes.status != 200)
          throw new Error('Greška prilikom učitavanja korisničkih podataka');

        let userDetails = userDetailsRes.data;
        let slanjeMailovaService = new SlanjeMailovaService({
          filePath: filePath,
          user: userDetails.email_za_slanje,
          pass: userDetails.password_email_za_slanje
        });

        await slanjeMailovaService.posaljiEmailoveZaposlenima({
          listaZaposlenih: odabraniZaposleni,
          onSuccess: async zaposleni => {
            rezultatiSlanjaTemp.push({
              zaposleni: `${zaposleni.dbEmployee.sifra} - ${
                zaposleni.dbEmployee.prezime
              } ${zaposleni.dbEmployee.ime} - ${zaposleni.dbEmployee.email1 ??
                ''} ${zaposleni.dbEmployee.email2 ?? ''}`,
              message: '',
              uspesno: true
            });
            setSendingResults([...rezultatiSlanjaTemp]);
          },
          onFail: async (zaposleni, e) => {
            rezultatiSlanjaTemp.push({
              zaposleni: `${zaposleni.dbEmployee.sifra} - ${
                zaposleni.dbEmployee.prezime
              } ${zaposleni.dbEmployee.ime} - ${zaposleni.dbEmployee.email1 ??
                ''} ${zaposleni.dbEmployee.email2 ?? ''}`,
              message: e.message,
              uspesno: false
            });
            setSendingResults([...rezultatiSlanjaTemp]);
          }
        });

        setUspesno(true);

        setSlanjeUToku(false);
      } catch (e) {
        setSlanjeUToku(false);
        if (e instanceof MailAuthException) {
          dialog.showMessageBox(getCurrentWindow(), {
            title: 'Računovođa',
            message: e.message,
            type: 'error'
          });
        }
        if (e instanceof NepredvidjenException) {
          dialog.showMessageBox(getCurrentWindow(), {
            title: 'Računovođa',
            message: e.message,
            type: 'error'
          });
        }
        setUspesno(false);
        setGreska(e.message);
      } finally {
        if (rezultatiSlanjaTemp.length > 0)
          await createPdfFile(godina, fileSubject, rezultatiSlanjaTemp);
      }
      setKrajProcesa(true);
    };

    return (
      <Container
        className="noselect"
        style={{
          height: '100%',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <header style={{ flex: 'none' }}>
          <Row>
            <Col>
              <div>
                putanja fajla : <b>{filePath}</b>
              </div>
            </Col>
          </Row>

          <h4>{fileSubject}</h4>
          {slanjeUToku ? (
            <span style={{ color: 'red' }}>
              Proces slanja mailova je pokrenut. Ne prekidajte rad programa!
            </span>
          ) : (
            <span style={{ color: '#007bff' }}>
              Proces slanja mailova je završen!
            </span>
          )}
        </header>
        <main style={{ overflowY: 'auto', flex: 'auto' }}>
          {sendingResults && sendingResults.length > 0 && (
            <Row style={{ width: '100%' }}>
              <Col>
                <div
                  style={{
                    // maxHeight: 500,
                    overflowY: 'auto',
                    overflowX: 'auto'
                  }}
                >
                  <Table striped bordered hover>
                    <tbody>
                      {sendingResults.map((s, i) => (
                        <tr key={i}>
                          {s.uspesno ? (
                            <td style={{ color: 'green' }}>
                              {s.zaposleni} <i className="fa fa-check"></i>
                            </td>
                          ) : (
                            <td style={{ color: 'red' }}>{s.zaposleni}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          )}
        </main>
        <footer style={{ flex: 'none', paddingBottom: 10 }}>
          {slanjeUToku == true ? (
            <div style={{ width: '100%' }}>
              <div style={{ margin: '0 auto', display: 'block', width: 100 }}>
                <ClipLoader size={35} color={'#123abc'} loading={true} />
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center'
              }}
            >
              <Button onClick={() => history.push(routes.DOSTAVLJAC_MAILOVA)}>
                Gotovo
              </Button>
            </div>
          )}
        </footer>
      </Container>
    );
  } catch (e) {
    history.push(routes.DOSTAVLJAC_MAILOVA);
    return null;
  }
}
