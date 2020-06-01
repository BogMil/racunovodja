import React, { useEffect } from 'react';
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Table
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import { useFilePicker } from 'react-sage';
import { close } from './uploadFileModal.actions';
import { reloadEmployees } from '../../employees.actions';

import { handleResponse } from '../../../../utils/responseHandler';
import { PdfEmployeeExtractor } from '../../../../services/employeeExtractor/ExmployeePdfExtractor';
import { InvalidFileException } from '../../../../services/employeeExtractor/exceptions/invalidFileException';
import { Employee } from '../../../../services/employeeExtractor/employeeExtractor.types';
import ClipLoader from 'react-spinners/ClipLoader';
import * as service from '../../employee.service';

const employeeExtractor = new PdfEmployeeExtractor();

export default function UploadFileModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.uploadModal;
  });

  const handleClose = () => {
    dispatch(close());
    setFilePath('');
    setError('');
    setMissingEmployees([]);
    setFetchingMissingEmployees(false);
  };
  const [filePath, setFilePath] = React.useState('');
  const [error, setError] = React.useState('');
  const [
    fetchingMissingEmployees,
    setFetchingMissingEmployees
  ] = React.useState(false);
  const [insertingEmployees, setInsertingEmployees] = React.useState(false);
  const [missingEmployees, setMissingEmployees] = React.useState<Employee[]>(
    []
  );

  const { files, onClick, HiddenFileInput } = useFilePicker({});

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

  const insertEmployees = () => {
    setInsertingEmployees(true);
    missingEmployees.forEach(employee=>{
      service.
    })
  };
  useEffect(() => {
    let file = files ? files[0] : null;
    if (!file) return;
    setError('');
    setFilePath(file.path);
    loadEmployees(file.path);
    setMissingEmployees([]);

    async function loadEmployees(path: string) {
      try {
        await setFetchingMissingEmployees(true);
        let extractedEmployees = await employeeExtractor.extractFromFile(path);
        await fetchMissingEmployees(extractedEmployees);

        await setFetchingMissingEmployees(false);
      } catch (e) {
        if (e instanceof InvalidFileException) {
          setError(e.message);
          setFetchingMissingEmployees(false);
          setMissingEmployees([]);
          return;
        }
      }
    }
  }, [files]);

  return (
    <Modal
      backdrop="static"
      centered
      show={store.show}
      onHide={handleClose}
      className="noselect"
      size="lg"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">
          Učitavanje zaposlenih iz platnog listića
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
                  <Button onClick={onClick}>Učitaj fajl</Button>
                  <HiddenFileInput accept=".pdf" multiple={false} />
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
      </Modal.Body>

      <Modal.Footer>
        <div style={{ margin: '0 auto', display: 'block' }}>
          {fetchingMissingEmployees ? (
            <ClipLoader
              size={35}
              color={'#123abc'}
              loading={fetchingMissingEmployees}
            />
          ) : insertingEmployees ? (
            <div>loading</div>
          ) : (
            missingEmployees.length > 0 && (
              <Button variant="primary" onClick={insertEmployees}>
                Upiši
              </Button>
            )
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}
