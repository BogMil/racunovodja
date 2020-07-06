import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import routes from '../../constants/routes.json';
import { PodaciOSlanjuZaSlanje } from './dostavljacMailova.types';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import { PDFDocument } from 'pdf-lib';

export default function SlanjeMailovaComponent() {
  const { filePath, fileSubject, odabraniZaposleni } = useLocation()
    .state as PodaciOSlanjuZaSlanje;

  const test = async () => {
    const fs = require('fs');
    let pdfMake = require('pdfmake/build/pdfmake');
    let pdfFonts = require('pdfmake/build/vfs_fonts');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const pdfjs = require('pdfjs-dist');
    const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    let doc = await pdfjs.getDocument(filePath).promise;
    let page = await doc.getPage(1);

    // This pipes the POST data to the file
    const pdfDoc = await PDFDocument.create();
    let firstDonorPdfBytes = fs.readFileSync(filePath);

    const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes);
    const [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [0]);

    pdfDoc.addPage(firstDonorPage);
    const pdfBytes = await pdfDoc.save();

    fs.writeFile('C:\\Users\\VS\\OneDrive\\Desktop\\a.pdf', pdfBytes, e => {
      console.log(e);
    });
  };

  test();

  return (
    <Container className="noselect">
      <Row>
        <Col>
          <div>
            putanja fajla : <b>{filePath}</b>
          </div>
        </Col>
      </Row>

      <h4>{fileSubject}</h4>
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
              <tbody></tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
