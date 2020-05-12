import React from 'react';
import { Form, Table } from 'react-bootstrap';

export default function Employees() {
  return(
    <Table striped bordered hover size="sm">
    <thead>
      <tr>
        <th>Aktivan</th>
        <th>JMBG</th>
        <th>Broj zaposlenog</th>
        <th>Prezime</th>
        <th>Ime</th>
        <th>Broj računa</th>
        <th>Opština stanovanja</th>
        <th>Podrazumevana relacija</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{width:80}}><Form.Check type="checkbox" label=""/></td>
        <td style={{width:100, verticalAlign:'middle'}}>9999999999999</td>
        <td style={{width:150}}>77777777</td>
        <td style={{width:200}}>Bogdanovic</td>
        <td style={{width:200}}>Milan</td>
        <td style={{width:200}}>160-5800000000000-00</td>
        <td style={{width:200}}>Backo petrovo selo</td>
        <td style={{width:300}}>
        <Table striped bordered hover size="sm">
            <tbody>
                <tr>
                    <td style={{width:100}}>A-B-A</td>
                </tr>
                <tr>
                    <td style={{width:100}}>A-B-A</td>
                </tr>
            </tbody>
        </Table>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td>Jacob</td>
        <td>Thornton</td>
        <td>@fat</td>
      </tr>
      <tr>
        <td>3</td>
        <td >Larry the Bird</td>
        <td>@twitter</td>
      </tr>
    </tbody>
  </Table>
  );
}
