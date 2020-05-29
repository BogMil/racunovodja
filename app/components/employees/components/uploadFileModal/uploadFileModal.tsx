import React, { useEffect } from 'react';
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import { useFilePicker } from 'react-sage';
import { close } from './uploadFileModal.actions';
import { reloadEmployees } from '../../employees.actions';

import { handleResponse } from '../../../../utils/responseHandler';
import { getLinesFromPage } from '../../../../utils/pdfFileManipulations/getLinesFromPage';
import { PdfEmployeeExtractor } from '../../../../services/employeeExtractor/ExmployeePdfExtractor';
import { InvalidFileException } from '../../../../services/employeeExtractor/exceptions/invalidFileException';

const employeeExtractor = new PdfEmployeeExtractor();

export default function UploadFileModal() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.employeesCombined.uploadModal;
  });

  const handleClose = () => {
    dispatch(close());
    setFilePath('');
  };
  const [filePath, setFilePath] = React.useState('');
  const [error, setError] = React.useState('');
  const { files, onClick, HiddenFileInput } = useFilePicker({});

  const handleSave = async () => {};

  useEffect(() => {
    let file = files ? files[0] : null;
    if (!file) return;
    setError('');
    setFilePath(file.path);
    loadEmployees(file.path);

    async function loadEmployees(path: string) {
      try {
        let employees = await employeeExtractor.extractFromFile(path);

        console.log(employees);
      } catch (e) {
        if (e instanceof InvalidFileException) {
          setError(e.message);
          return;
        }
        console.log(e);
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
                  rows={3}
                  style={{ resize: 'none' }}
                />
                <InputGroup.Append>
                  <Button onClick={onClick}>Učitaj fajl</Button>
                  <HiddenFileInput accept=".pdf" multiple={false} />
                </InputGroup.Append>
              </InputGroup>
              {error}
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Sačuvaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
