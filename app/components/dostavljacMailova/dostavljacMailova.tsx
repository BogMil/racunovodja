import React, { useEffect } from 'react';
import { Container, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { InvalidFileException } from '../../services/pdfParser/exceptions/invalidFileException';
import { handleResponse } from '../../utils/responseHandler';
import * as service from '../zaposleni/zaposleni.service';
import { ExtractedEmployeeWithPageNumbers } from '../../services/pdfParser/pdfParser.types';
import { FileChecker } from '../../services/FileChecker';
import PlatniListicTemplate from './components/platniListicMissingEmployeesTemplate';
import ObustavaTemplate from './components/obustavaMissingEmployeesTemplate';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import { PodaciOSlanjuZaIzborZaposlenih } from './dostavljacMailova.types';
import { get_IZVESTAJI_SLANJA_MAILOVA_DIR } from '../../constants/files';
import { shell } from 'electron';
import * as DetaljiKorisnikaService from '../detaljiKorisnika/detaljiKorisnika.service';
import { DetaljiKorisnika } from '../detaljiKorisnika/detaljiKorisnika.types';
const { dialog, getCurrentWindow } = require('electron').remote;
const fs = require('fs');
const employeeExtractor = new PdfDataExtractor();

export default function DostavljacMailovaComponent() {
  const [filePath, setFilePath] = React.useState('');
  const [isPlatniListic, setIsPlatniListic] = React.useState(false);
  const [isObustava, setIsObustava] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchedEmployees, setFetchedEmployees] = React.useState(false);
  const [error, setError] = React.useState('');
  const [missingEmployees, setMissingEmployees] = React.useState<
    ExtractedEmployeeWithPageNumbers[]
  >([]);
  const [allExtractedEmployees, setAllExtractedEmployees] = React.useState<
    ExtractedEmployeeWithPageNumbers[]
  >([]);

  const [uTokuProveraPrava, setUTokuProveraPrava] = React.useState(true);
  const [imaPravaPristupa, setImaPravaPristupa] = React.useState(false);

  const setInitialState = () => {
    setFilePath('');
    setIsPlatniListic(false);
    setIsObustava(false);
    setIsLoading(false);
    setFetchedEmployees(false);
    setError('');
    setMissingEmployees([]);
  };

  const openDialog = () => {
    dialog
      .showOpenDialog(getCurrentWindow(), {
        properties: ['openFile'],
        filters: [{ name: 'Custom File Type', extensions: ['pdf'] }]
      })
      .then(result => {
        if (!result.canceled) {
          setFilePath(result.filePaths[0]);
        }
      })
      .catch(err => {
        dialog.showMessageBox({ message: err });
      });
  };

  const otvoriFolderSaIzvestajima = () => {
    shell.openItem(
      get_IZVESTAJI_SLANJA_MAILOVA_DIR(new Date().getFullYear().toString())
    );
  };

  const otvoriMail = () => {
    shell.openExternal('https://host105.dwhost.net:2096/');
  };

  const fetchMissingEmployees = async (
    extractedEmployees: ExtractedEmployeeWithPageNumbers[]
  ) => {
    let numbers = extractedEmployees.map(e => e.sifra);
    handleResponse(
      await service.getMissingEmployeeNumbers(numbers),
      (res: any) => {
        if (res.data.length <= 0) return;
        let missingEmployeesNumbers = res.data;
        let missingEmps: any[] = [];
        missingEmployeesNumbers.forEach((number: string) => {
          let employeeToInsert = extractedEmployees.find(
            x => x.sifra == number
          );
          missingEmps.push(employeeToInsert);
        });

        setMissingEmployees(missingEmps);
      }
    );
  };

  useEffect(() => {
    proveriPravaPristupaAsync();
  }, []);

  const proveriPravaPristupaAsync = async () => {
    handleResponse(await DetaljiKorisnikaService.get(), (res: any) => {
      const {
        email_za_slanje,
        password_email_za_slanje
      } = res.data as DetaljiKorisnika;

      if (
        email_za_slanje != null &&
        email_za_slanje != '' &&
        password_email_za_slanje != null &&
        password_email_za_slanje != ''
      )
        setImaPravaPristupa(true);
      setUTokuProveraPrava(false);
    });
  };
  useEffect(() => {
    if (filePath == '') return;
    setMissingEmployees([]);
    setAllExtractedEmployees([]);
    checkFileValidityAsync();
  }, [filePath]);

  async function checkFileValidityAsync() {
    try {
      setError('');
      setIsLoading(true);
      setFetchedEmployees(false);
      setIsPlatniListic(await FileChecker.isPlatniListic(filePath));
      setIsObustava(await FileChecker.isObustava(filePath));
      let extractedEmployees = await employeeExtractor.employees(filePath);
      setAllExtractedEmployees(extractedEmployees);
      await fetchMissingEmployees(extractedEmployees);
      setIsLoading(false);
      setFetchedEmployees(true);
    } catch (e) {
      setIsLoading(false);
      setMissingEmployees([]);
      setAllExtractedEmployees([]);
      setFetchedEmployees(false);
      if (e instanceof InvalidFileException) {
        setError(e.message);
        return;
      }
    }
  }

  const currentYear = new Date().getFullYear();
  const folderSaIzvestajimaPostoji = fs.existsSync(
    get_IZVESTAJI_SLANJA_MAILOVA_DIR(currentYear.toString())
  );

  if (uTokuProveraPrava) return null;

  if (!imaPravaPristupa) {
    return (
      <div
        className="noselect"
        style={{
          paddingLeft: 20,
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%'
        }}
      >
        <h3>Još uvek Vam nije dodeljena email adresa za slanje.</h3>
        <h3>
          Email nalog će biti otvoren u najkraćem roku i bićete obavešteni o
          tome!
        </h3>
      </div>
    );
  }

  return (
    <Container style={{ marginTop: 10 }} className="noselect">
      <Row>
        <Col>
          <Button
            style={{ marginRight: 10 }}
            title="Otvori mail"
            onClick={otvoriMail}
          >
            <i className="fa fa-envelope" />
          </Button>
          {folderSaIzvestajimaPostoji && (
            <Button
              title="Otvori folder sa izveštajima slanja mail-ova za tekuću godinu."
              onClick={otvoriFolderSaIzvestajima}
            >
              <i className="fa fa-folder" />
            </Button>
          )}
        </Col>
      </Row>
      <Form style={{ marginTop: 10 }}>
        <div>
          <div>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Izaberite .pdf fajl sa platnim listićima"
                disabled
                value={filePath}
                as="textarea"
                rows={2}
                style={{ resize: 'none' }}
              />
              <InputGroup.Append>
                <Button onClick={openDialog}>Učitaj fajl</Button>
              </InputGroup.Append>
            </InputGroup>
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </div>
        </div>
      </Form>

      {missingEmployees.length > 0 && isPlatniListic && fetchedEmployees && (
        <PlatniListicTemplate
          missingEmployees={missingEmployees}
          setInitialState={setInitialState}
          filePath={filePath}
          zaposleniUFajlu={allExtractedEmployees}
        />
      )}

      {missingEmployees.length > 0 && isObustava && fetchedEmployees && (
        <ObustavaTemplate
          missingEmployees={missingEmployees}
          setInitialState={setInitialState}
          filePath={filePath}
          zaposleniUFajlu={allExtractedEmployees}
        />
      )}

      {missingEmployees.length == 0 && fetchedEmployees && (
        <Redirect
          to={{
            pathname: routes.DOSTAVLJAC_MAILOVA_IZBOR_ZAPOSLENIH,
            state: {
              filePath: filePath,
              zaposleniUFajlu: allExtractedEmployees
            } as PodaciOSlanjuZaIzborZaposlenih
          }}
        />
      )}

      <div style={{ width: '100%' }}>
        <div style={{ margin: '0 auto', display: 'block', width: 100 }}>
          <ClipLoader size={35} color={'#123abc'} loading={isLoading} />
        </div>
      </div>
    </Container>
  );
}
