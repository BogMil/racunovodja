import React, { useEffect } from 'react';
import { Container, Form, InputGroup, Button, Row, Col } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import { handleResponse } from '../../utils/responseHandler';
import * as service from '../zaposleni/zaposleni.service';
import PlatniListicTemplate from './components/platniListicMissingEmployeesTemplate';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import {
  DbEmployeeWithFile,
  PodaciOSlanjuZaIzborZaposlenih,
  ZaposleniSaSifromIFajlom
} from './dostavljacMailova.types';
import { get_IZVESTAJI_SLANJA_MAILOVA_DIR } from '../../constants/files';
import { shell } from 'electron';
import * as DetaljiKorisnikaService from '../detaljiKorisnika/detaljiKorisnika.service';
import { DetaljiKorisnika } from '../detaljiKorisnika/detaljiKorisnika.types';
import XLSX from 'xlsx';
import { Zaposleni as DbEmployee } from '../zaposleni/zaposleni.types';

const { dialog, getCurrentWindow } = require('electron').remote;
const fs = require('fs');

export default function DostavljacMailovaV2Component() {
  const [folderPath, setFolderPath] = React.useState('');

  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchedEmployees, setFetchedEmployees] = React.useState(false);
  const [error, setError] = React.useState('');
  const [missingEmployees, setMissingEmployees] = React.useState<any[]>([]);
  const [allExtractedEmployees, setAllExtractedEmployees] = React.useState<
    ZaposleniSaSifromIFajlom[]
  >([]);

  const [uTokuProveraPrava, setUTokuProveraPrava] = React.useState(true);
  const [imaPravaPristupa, setImaPravaPristupa] = React.useState(false);

  const setInitialState = () => {
    setFolderPath('');
    setIsLoading(false);

    setFetchedEmployees(false);
    setError('');
    setMissingEmployees([]);
  };

  const getXslFileName = (files: string[]) => {
    let file = null;
    files.forEach((f: string) => {
      if (isXlsFile(f)) {
        file = f;
        return;
      }
    });

    return file;
  };
  const isXlsFile = (file: String) => {
    let lastDot = file.lastIndexOf('.') + 1;
    return file.toLowerCase().substr(lastDot) === 'xls';
  };

  const getZaposleniUFolderu = (
    folderPath: string,
    xlsFile: string
  ): ZaposleniSaSifromIFajlom[] => {
    const xslFilePath = `${folderPath}\\${xlsFile}`;
    var xlsData = XLSX.readFile(xslFilePath);

    let ref = xlsData.Sheets[xlsData.SheetNames[0]]['!ref'];
    let eIndex = ref?.lastIndexOf('E') ?? -1;
    let lastRowWithDataNum = (parseInt(ref?.substr(eIndex + 1) ?? '') ?? 0) - 1;
    let cells = xlsData.Sheets[xlsData.SheetNames[0]];

    let zaposleniUFolderu: ZaposleniSaSifromIFajlom[] = [];
    for (let i = 7; i <= lastRowWithDataNum; i++) {
      let obj = {
        sifra: cells[`A${i}`].v,
        fajl: `${folderPath}\\${cells[`E${i}`].v}`,
        ime: cells[`C${i}`].v,
        prezime: cells[`B${i}`].v
      };
      zaposleniUFolderu.push(obj);
    }

    return zaposleniUFolderu;
  };

  const openDialog = () => {
    dialog
      .showOpenDialog(getCurrentWindow(), {
        properties: ['openDirectory']
      })
      .then(result => {
        if (result.canceled) return;

        let fPath = result.filePaths[0];
        setFolderPath(fPath);

        fs.readdir(fPath, async (err: any, files: string[]) => {
          setIsLoading(true);

          let xlsFileName = getXslFileName(files);

          if (xlsFileName === null) {
            setError('Odabrani folder nije ispravan!');
            setIsLoading(false);
            setFetchedEmployees(false);
            setMissingEmployees([]);
            return;
          }
          setError('');

          let zaposleniUFolderu = getZaposleniUFolderu(fPath, xlsFileName);

          setMissingEmployees([]);
          setAllExtractedEmployees([]);
          setFetchedEmployees(false);

          let zaposleniBezMaila: DbEmployee[] = [];
          let zaposleniKojihNemaUBazi: ZaposleniSaSifromIFajlom[] = [];
          let zaposleniKojiImaMail: DbEmployeeWithFile[] = [];

          var dbZaposleniRes = await service.get();
          zaposleniUFolderu.forEach(zuf => {
            let zaposleniPronadjenUBazi = dbZaposleniRes.data.filter(
              (dbz: DbEmployee) => {
                return parseInt(dbz.sifra) === parseInt(zuf.sifra);
              }
            )[0];

            if (zaposleniPronadjenUBazi === undefined) {
              zaposleniKojihNemaUBazi.push(zuf);
            } else if (
              (zaposleniPronadjenUBazi.email1 === null ||
                zaposleniPronadjenUBazi.email1 === '') &&
              (zaposleniPronadjenUBazi.email2 === null ||
                zaposleniPronadjenUBazi.email2 === '')
            ) {
              zaposleniBezMaila.push(zaposleniPronadjenUBazi);
            } else {
              zaposleniKojiImaMail.push({
                ...zaposleniPronadjenUBazi,
                fajl: zuf.fajl
              });
            }
          });

          setFolderPath(fPath);
          setMissingEmployees(zaposleniKojihNemaUBazi);
          setAllExtractedEmployees(zaposleniUFolderu);
          setFetchedEmployees(true);

          setIsLoading(false);
        });
      })
      .catch(err => {
        dialog.showMessageBox({ message: err });
        setIsLoading(false);
        setFetchedEmployees(false);
        setMissingEmployees([]);
        setAllExtractedEmployees([]);
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
    if (folderPath == '') return;
    setMissingEmployees([]);
    setAllExtractedEmployees([]);
  }, [folderPath]);

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
        <Col style={{ textAlign: 'center', color: 'red', fontWeight: 500 }}>
          !!! Slanje platnih listića !!!
        </Col>
      </Row>
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
                placeholder="Izaberite folder sa platnim listićima"
                disabled
                value={folderPath}
                as="textarea"
                rows={2}
                style={{ resize: 'none' }}
              />
              <InputGroup.Append>
                <Button onClick={openDialog}>Učitaj folder</Button>
              </InputGroup.Append>
            </InputGroup>
            {error && <span style={{ color: 'red' }}>{error}</span>}
          </div>
        </div>
      </Form>

      {missingEmployees.length > 0 && fetchedEmployees && (
        <PlatniListicTemplate
          missingEmployees={missingEmployees}
          setInitialState={setInitialState}
          filePath={folderPath}
          zaposleniUFajlu={allExtractedEmployees}
        />
      )}

      {missingEmployees.length == 0 && fetchedEmployees && (
        <Redirect
          to={{
            pathname: routes.DOSTAVLJAC_MAILOVA_IZBOR_ZAPOSLENIH_V2,
            state: {
              filePath: folderPath,
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
