import React, { useEffect } from 'react';
import {
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  Button,
  Table,
  ProgressBar
} from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import { PdfEmployeeExtractor } from '../../services/employeeExtractor/ExmployeePdfExtractor';
import { InvalidFileException } from '../../services/employeeExtractor/exceptions/invalidFileException';
import { handleResponse } from '../../utils/responseHandler';
import * as service from '../../components/employees/employee.service';
import { Employee } from '../../services/employeeExtractor/employeeExtractor.types';
const { dialog, getCurrentWindow } = require('electron').remote;

const employeeExtractor = new PdfEmployeeExtractor();

export default function DostavljacMailovaComponent() {
  const [filePath, setFilePath] = React.useState('');
  const [error, setError] = React.useState('');
  const [missingEmployees, setMissingEmployees] = React.useState<Employee[]>(
    []
  );

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

  const fetchMissingEmployees = async (extractedEmployees: Employee[]) => {
    let jmbgs = extractedEmployees.map(e => e.jmbg);
    handleResponse(await service.getMissingJmbgs(jmbgs), (res: any) => {
      if (res.data.length > 0) {
        let missingEmployeesJmbg = res.data;
        let missingEmps: any[] = [];
        missingEmployeesJmbg.forEach((jmbg: string) => {
          let employeeToInsert = extractedEmployees.find(x => x.jmbg == jmbg);
          missingEmps.push(employeeToInsert);
        });

        setMissingEmployees(missingEmps);
      }
    });
  };

  useEffect(() => {
    async function checkFileValidity() {
      try {
        let extractedEmployees = await employeeExtractor.extractFromFile(
          filePath
        );
        await fetchMissingEmployees(extractedEmployees);
      } catch (e) {
        setMissingEmployees([]);
        if (e instanceof InvalidFileException) {
          setError(e.message);
          return;
        }
      }
    }

    checkFileValidity();
  }, [filePath]);

  return (
    <Container style={{ marginTop: 10, paddingLeft: 10, paddingRight: 10 }}>
      <Form>
        <Row>
          <Col md={12}>
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
          </Col>
        </Row>
      </Form>

      {missingEmployees.length > 0 && (
        <>
          <h4>Sledeći zaposleni će biti upisani u bazu:</h4>
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
                    {missingEmployees.map(e => (
                      <tr key={e.jmbg}>
                        <td>{e.jmbg}</td>
                        <td>{e.number}</td>
                        <td>{e.last_name}</td>
                        <td>{e.first_name}</td>
                        <td>{e.banc_account}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </>
      )}

      <div style={{ margin: '0 auto', display: 'block' }}>
        <ClipLoader size={35} color={'#123abc'} />
      </div>
    </Container>
  );
}
