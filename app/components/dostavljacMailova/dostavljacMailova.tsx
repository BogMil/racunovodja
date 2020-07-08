import React, { useEffect } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { InvalidFileException } from '../../services/pdfParser/exceptions/invalidFileException';
import { handleResponse } from '../../utils/responseHandler';
import * as service from '../../components/employees/employee.service';
import { ExtractedEmployeeWithPageNumbers } from '../../services/pdfParser/pdfParser.types';
import { FileChecker } from '../../services/FileChecker';
import PlatniListicTemplate from './components/platniListicMissingEmployeesTemplate';
import ObustavaTemplate from './components/obustavaMissingEmployeesTemplate';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import { PodaciOSlanjuZaIzborZaposlenih } from './dostavljacMailova.types';
const { dialog, getCurrentWindow } = require('electron').remote;

const employeeExtractor = new PdfDataExtractor();

export default function DostavljacMailovaComponent() {
  const [filePath, setFilePath] = React.useState('');
  const [isPlatniListic, setIsPlatniListic] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchedEmployees, setFetchedEmployees] = React.useState(false);
  const [error, setError] = React.useState('');
  const [missingEmployees, setMissingEmployees] = React.useState<
    ExtractedEmployeeWithPageNumbers[]
  >([]);
  const [allExtractedEmployees, setAllExtractedEmployees] = React.useState<
    ExtractedEmployeeWithPageNumbers[]
  >([]);

  const setInitialState = () => {
    setFilePath('');
    setIsPlatniListic(false);
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

  const fetchMissingEmployees = async (
    extractedEmployees: ExtractedEmployeeWithPageNumbers[]
  ) => {
    let numbers = extractedEmployees.map(e => e.number);
    handleResponse(
      await service.getMissingEmployeeNumbers(numbers),
      (res: any) => {
        if (res.data.length > 0) {
          let missingEmployeesNumbers = res.data;
          let missingEmps: any[] = [];
          missingEmployeesNumbers.forEach((number: string) => {
            let employeeToInsert = extractedEmployees.find(
              x => x.number == number
            );
            missingEmps.push(employeeToInsert);
          });

          setMissingEmployees(missingEmps);
        }
      }
    );
  };

  useEffect(() => {
    if (filePath == '') return;
    setMissingEmployees([]);
    setAllExtractedEmployees([]);
    async function checkFileValidity() {
      try {
        setError('');
        setIsLoading(true);
        setFetchedEmployees(false);
        setIsPlatniListic(await FileChecker.isPlatniListic(filePath));
        let extractedEmployees = await employeeExtractor.employees(filePath);
        console.log(extractedEmployees);
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
    checkFileValidity();
  }, [filePath]);

  useEffect(() => {
    if (missingEmployees.length > 0 && isPlatniListic != true)
      console.log('fale');
  }, [missingEmployees]);

  return (
    <Container style={{ marginTop: 10 }} className="noselect">
      <Form>
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

      {missingEmployees.length > 0 && !isPlatniListic && fetchedEmployees && (
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
