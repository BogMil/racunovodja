import React, { useState } from 'react';
import { useLocation } from 'react-router';
import {
  PodaciOSlanjuZaSlanje,
  DbEmployeeWithPages
} from './dostavljacMailova.types';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { PDFDocument } from 'pdf-lib';
import { PdfDataExtractor } from '../../services/pdfParser/PdfDataExtractor';
import { MailSender } from '../../services/mailSender/mailSender';
import { send } from 'process';
import { promisify } from 'util';

const fs = require('fs');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const pdfjs = require('pdfjs-dist');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
const pdfDataExtractor = new PdfDataExtractor();

type MailProps = { user: string; pass: string; mail: any };

export default function SlanjeMailovaComponent() {
  const { filePath, fileSubject, odabraniZaposleni } = useLocation()
    .state as PodaciOSlanjuZaSlanje;

  const [sendingResults, setSendingResults] = useState<String[]>([]);

  const mailSender: MailSender = new MailSender();
  const test = async () => {
    let filePdfBytes = fs.readFileSync(filePath);
    let file = await PDFDocument.load(filePdfBytes);
    let subject = await pdfDataExtractor.subject(filePath);

    const z = async (zaposleni: DbEmployeeWithPages) => {
      let pdfBytes = await kreirajPdfFajlSaRelefantimStranicama(
        zaposleni,
        file
      );

      let mail = {
        from: 'test@bogmilko.rs',
        to: zaposleni.dbEmployee.email,
        subject: subject,
        text: 'У прилогу достављамо',
        html:
          '<b>Ovaj mail je dostavljen putem aplikacije Računovođa.</b><br/><b>www.bogmilko.rs</b>',
        attachments: [
          {
            filename: subject + '.pdf',
            content: pdfBytes
          }
        ]
      };

      let emailProps: MailProps = {
        user: 'podrska@bogmilko.rs',
        pass: '',
        mail
      };

      console.log('sending...');
      await trySendMail(emailProps, zaposleni);
      console.log('sent');
    };

    mailSender.init('podrska@bogmilko.rs', '');

    for (const zaposleni of odabraniZaposleni) {
      await z(zaposleni);
    }
    mailSender.closeConnections();
  };
  let x = [];
  const trySendMail = async (
    emailProps: MailProps,
    zaposleni: DbEmployeeWithPages
  ) => {
    try {
      await mailSender.send(emailProps.user, emailProps.pass, emailProps.mail);
      x.push(zaposleni.dbEmployee.last_name);
      setSendingResults([...x]);
    } catch (e) {
      console.log(e);
      x.push(zaposleni.dbEmployee.last_name);
      setSendingResults([...x]);
    }
  };

  async function kreirajPdfFajlSaRelefantimStranicama(
    zaposleni: DbEmployeeWithPages,
    file: PDFDocument
  ): Promise<Uint8Array> {
    let pdfDoc = await PDFDocument.create();

    for (let i = 0; i < zaposleni.pageNumbers.length; i++) {
      let [page] = await pdfDoc.copyPages(file, [zaposleni.pageNumbers[i] - 1]);
      pdfDoc.addPage(page);
    }

    return await pdfDoc.save();
  }
  console.log(sendingResults);
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
              <tbody>
                {sendingResults.map((s, i) => (
                  <tr>
                    <td key={i}>{s}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
      <Button onClick={test}>asd</Button>
    </Container>
  );
}
