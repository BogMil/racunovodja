import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosCatchHandler } from '../../utils/axiosErrorHandler';
import { RezultatSlanja } from '../dostavljacMailova/dostavljacMailova.types';
const API_URL = `${BASE_URL}/api/slanjeMailova`;
const fs = require('fs');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const { dialog, getCurrentWindow } = require('electron').remote;

interface SlanjeMejlaLog {
  created_at: string;
  subject: string;
  uspesno: string;
  email_korisnika: string;
  id: number;
}

export default function IzvestajiComponent() {
  const [izvestaji, setIzvestaji] = useState<SlanjeMejlaLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  var loadLogs = async () => {
    let res = await axios.get(`${API_URL}/logs`).catch(axiosCatchHandler);
    setIzvestaji(res.data);
  };

  const pretifyDatetime = (datetime: string) => {
    datetime = datetime.replace('.000000Z', '');
    datetime = datetime.replace('T', ' ');
    return datetime;
  };

  async function createPdfFile(
    filePath: string,
    subject: string,
    logId: number,
    created_at: string
  ) {
    try {
      fs.writeFile(filePath, '', () => {});
      let res = await axios
        .get(`${API_URL}/log/${logId}`)
        .catch(axiosCatchHandler);
      let rezultatiSlanja = res.data as RezultatSlanja[];
      let datumKreiranja = created_at.substring(0, created_at.indexOf('T'));
      let datumKreiranjaArr = datumKreiranja.split('-');
      datumKreiranja = `${datumKreiranjaArr[2]}.${datumKreiranjaArr[1]}.${datumKreiranjaArr[0]}`;
      let tableBody = rezultatiSlanja.map(rezultatSlanja => {
        return [
          {
            text: rezultatSlanja.zaposleni,
            color: rezultatSlanja.uspesno ? 'green' : 'red'
          }
        ];
      });
      const zeroPadding = {
        paddingLeft: function() {
          return 0;
        },
        paddingRight: function() {
          return 0;
        },
        paddingTop: function() {
          return 0;
        },
        paddingBottom: function() {
          return 0;
        }
      };

      let currentDate = new Date();
      var docDefinition = {
        pageSize: 'A4',
        pageMargins: [10, 20, 10, 20],
        header: function() {
          return {
            text: `Rezultat slanja : ${subject} `,
            style: 'header',
            alignment: 'center',
            fontSize: 10
          };
        },
        footer: function(currentPage: number, pageCount: number) {
          return {
            width: '*',
            columns: [
              {
                width: '*',
                text: datumKreiranja,
                fontSize: 10,
                alignment: 'left',
                margin: [10, 0, 0, 0]
              },
              {
                width: '*',
                text: `${currentPage}/${pageCount}`,
                fontSize: 10,
                alignment: 'right',
                margin: [0, 0, 10, 0]
              }
            ]
          };
        },
        content: [
          {
            table: {
              dontBreakRows: true,
              widths: ['*'],
              body: tableBody
            },
            layout: { ...zeroPadding }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          }
        }
      };

      let pdfDoc = pdfMake.createPdf(docDefinition).getStream();

      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.end();

      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Računovođa',
        message: 'PDF fajl je uspešno kreiran',
        type: 'info'
      });
    } catch (e) {
      dialog.showErrorBox(
        'Računovođa',
        'Greška prilikom kreiranja pdf izveštaja'
      );
    }
  }

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>datum slanja</th>
            <th>naziv</th>
          </tr>
        </thead>
        <tbody>
          {izvestaji.map((log: SlanjeMejlaLog, i: number) => (
            <tr key={i}>
              <td>{pretifyDatetime(log.created_at)}</td>
              <td>{log.subject}</td>
              <td style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    dialog
                      .showSaveDialog(getCurrentWindow(), {
                        filters: [{ name: 'pdf', extensions: ['pdf'] }]
                      })
                      .then(result => {
                        if (!result.canceled) {
                          createPdfFile(
                            result.filePath as string,
                            log.subject,
                            log.id,
                            log.created_at
                          );
                        }
                      })
                      .catch(err => {
                        dialog.showMessageBox({ message: err });
                      });
                  }}
                >
                  <i className="fa fa-print" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
