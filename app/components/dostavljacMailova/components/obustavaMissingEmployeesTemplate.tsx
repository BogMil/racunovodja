import React from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { ExtractedEmployeeWithPageNumbers } from '../../../services/pdfParser/pdfParser.types';

type Props = {
  missingEmployees: ExtractedEmployeeWithPageNumbers[];
  setInitialState: () => void;
  zaposleniUFajlu: ExtractedEmployeeWithPageNumbers[];
  filePath: string;
};

export default function ObustavaTemplate(props: Props) {
  const {
    missingEmployees,
    setInitialState,
    filePath,
    zaposleniUFajlu
  } = props;

  return (
    <>
      <h5>U bazi nedostaju sledeći zaposleni</h5>
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
              <tbody>
                {missingEmployees.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        {e.last_name} {e.first_name}
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
          Možete da ih upišete u bazu na kartici -{' '}
          <span>
            <i className="fa fa-users" />
          </span>
          Zaposleni - učitavanjem iz platnog listića ili ručnim unosom.
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
            <Button style={{ marginRight: 5 }} onClick={setInitialState}>
              Odustani
            </Button>
            <Button>Nastavi</Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
