import { mk_IZVESTAJI_SLANJA_MAILOVA_DIR } from '../../constants/files';
import { RezultatSlanja } from './dostavljacMailova.types';
const fs = require('fs');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const { dialog, getCurrentWindow } = require('electron').remote;

export async function createPdfFile(
  year: string,
  subject: string,
  rezultatiSlanja: RezultatSlanja[]
) {
  try {
    let root = mk_IZVESTAJI_SLANJA_MAILOVA_DIR(year);
    let filePath = `${root}\\${subject.replace('/', '-')}-${Date.now()}.pdf`;
    fs.writeFile(filePath, '', () => {});

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
              text: `datum : ${currentDate.getDate()}.${currentDate.getMonth() +
                1}.${currentDate.getFullYear()}`,
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
