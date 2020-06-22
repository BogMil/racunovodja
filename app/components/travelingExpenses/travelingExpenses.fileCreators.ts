import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_XML_FILE,
  PUTNI_TROSKOVI_PDF_FILE
} from '../../constants/files';
import {
  EmployeeWithRelations,
  TravelingExpenseWithDetails,
  EmployeeTravelingExpenseCalculator
} from './travelingExpenses.types';
import { numberWithThousandSeparator } from '../../utils/numberWithThousandSeparator';
import getMonthName from '../../utils/getMonthName';
import { UserDetails } from '../userDetails/userDetails.types';
import { daysInMonth, isWeekday } from '../../utils/getBusinessDaysInMonth';

var fs = require('fs');
const { shell } = require('electron');
var builder = require('xmlbuilder');

export function create_PPP_PD_XML_File(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails,
  userDetails: UserDetails
) {
  let filePath = _create_PPP_PD_xmlFile(year, month);
  let xmlContent = createXmlContent(year, month, travelingExpense, userDetails);
  fs.writeFile(filePath, xmlContent, (e: any) => {
    console.log(e);
  });
}

export async function createPdfFile(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails,
  userDetails: UserDetails
) {
  let filePath = _createPdfFile(year, month);
  const fs = require('fs');
  let pdfMake = require('pdfmake/build/pdfmake');
  let pdfFonts = require('pdfmake/build/vfs_fonts');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  const leftBorders = [false, false, true, true];
  const middleBorders = [true, false, true, true];
  const rightBorders = [true, false, false, true];

  const employeeWithMultipleRelations = (
    employeeWithRelations: EmployeeWithRelations
  ) => {
    let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
      travelingExpense.year,
      travelingExpense.month,
      travelingExpense.maxNonTaxedValue,
      travelingExpense.preracun_na_bruto,
      travelingExpense.stopa
    );
    let calculation = employeeTravelingExpenseCalculator.getCalculation(
      employeeWithRelations
    );

    let relationsInnerTable = employeeWithRelations.relations_with_days.map(
      relationWithDays => {
        return [
          {
            text: relationWithDays.relation.name,
            border: leftBorders
          },
          {
            text: numberWithThousandSeparator(relationWithDays.relation.price),
            border: middleBorders,
            alignment: 'right'
          },
          {
            text: relationWithDays.days,
            border: middleBorders,
            alignment: 'center'
          },
          {
            text: numberWithThousandSeparator(
              relationWithDays.days * relationWithDays.relation.price
            ),
            border: rightBorders,
            alignment: 'right',
            fontSize: 10
          }
        ];
      }
    );

    let row: any[] = [];

    row[0] = {
      text: `${employeeWithRelations.employee.last_name} ${employeeWithRelations.employee.first_name}`
    };

    row[1] = {
      table: {
        widths: [150, 50, 30, '*'],
        body: [
          ...relationsInnerTable,
          [
            {
              colSpan: 3,
              text: '',
              border: [false, false, true, false]
            },
            {},
            {},
            {
              text: numberWithThousandSeparator(calculation.neto),
              border: [true, false, false, false],
              alignment: 'right'
            }
          ]
        ]
      },
      layout: {
        ...zeroPadding
      }
    };

    row[2] = {
      text: numberWithThousandSeparator(calculation.neoporezivo),
      alignment: 'right'
    };
    row[3] = {
      text: numberWithThousandSeparator(calculation.oporezivo),
      alignment: 'right'
    };
    row[4] = {
      text: numberWithThousandSeparator(calculation.brutoOporezivo),
      alignment: 'right'
    };
    row[5] = {
      text: numberWithThousandSeparator(calculation.porez),
      alignment: 'right'
    };
    return row;
  };

  const employeeWithOnlyOneRelation = (
    employeeWithRelations: EmployeeWithRelations
  ) => {
    let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
      travelingExpense.year,
      travelingExpense.month,
      travelingExpense.maxNonTaxedValue,
      travelingExpense.preracun_na_bruto,
      travelingExpense.stopa
    );
    let calculation = employeeTravelingExpenseCalculator.getCalculation(
      employeeWithRelations
    );

    let relationsInnerTable = employeeWithRelations.relations_with_days.map(
      relationWithDays => {
        return [
          {
            text: relationWithDays.relation.name,
            border: [false, false, true, false]
          },
          {
            text: numberWithThousandSeparator(relationWithDays.relation.price),
            border: [true, false, true, false],
            alignment: 'right'
          },
          {
            text: relationWithDays.days,
            border: [true, false, true, false],
            alignment: 'center'
          },
          {
            text: numberWithThousandSeparator(calculation.neto),
            border: [true, false, false, false],
            alignment: 'right'
          }
        ];
      }
    );

    let row: any[] = [];

    row[0] = {
      text: `${employeeWithRelations.employee.last_name} ${employeeWithRelations.employee.first_name}`
    };

    row[1] = {
      table: {
        widths: [150, 50, 30, '*'],
        body: [...relationsInnerTable]
      },
      layout: {
        ...zeroPadding
      }
    };

    row[2] = {
      text: numberWithThousandSeparator(calculation.neoporezivo),
      alignment: 'right'
    };
    row[3] = {
      text: numberWithThousandSeparator(calculation.oporezivo),
      alignment: 'right'
    };
    row[4] = {
      text: numberWithThousandSeparator(calculation.brutoOporezivo),
      alignment: 'right'
    };
    row[5] = {
      text: numberWithThousandSeparator(calculation.porez),
      alignment: 'right'
    };

    return row;
  };

  let tableBody = () =>
    travelingExpense.employees_with_relation.map(employeeWithRelations => {
      if (employeeWithRelations.relations_with_days.length == 1)
        return employeeWithOnlyOneRelation(employeeWithRelations);
      if (employeeWithRelations.relations_with_days.length > 1)
        return employeeWithMultipleRelations(employeeWithRelations);
      return;
    });

  let netoTotal = 0;
  let neoporeziviDeoTotal = 0;
  let oporeziviDeoTotal = 0;
  let brutoOporeziviDeoTotal = 0;
  let porezTotal = 0;

  travelingExpense.employees_with_relation.forEach(
    (employeeWithRelation: EmployeeWithRelations) => {
      let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
        travelingExpense.year,
        travelingExpense.month,
        travelingExpense.maxNonTaxedValue,
        travelingExpense.preracun_na_bruto,
        travelingExpense.stopa
      );
      let calculation = employeeTravelingExpenseCalculator.getCalculation(
        employeeWithRelation
      );
      netoTotal += calculation.neto;
      neoporeziviDeoTotal += calculation.neoporezivo;
      oporeziviDeoTotal += calculation.oporezivo;
      brutoOporeziviDeoTotal += calculation.brutoOporezivo;
      porezTotal += calculation.porez;
    }
  );

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [10, 20, 10, 20],
    header: function(currentPage: number) {
      if (currentPage != 1)
        return {
          text: `Obračun putnih troškova za ${getMonthName(month)} / ${year}`,
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
            text: `obračunao : `,
            fontSize: 10,
            alignment: 'center',
            width: 100
          },
          {
            width: 'auto',
            margin: [5, 5, 0, 0],
            table: {
              widths: [200],
              body: [[{ text: '', border: [false, false, false, true] }]]
            }
          },
          {
            text: `odgovorno lice : `,
            fontSize: 10,
            alignment: 'center',
            width: 100
          },
          {
            width: 'auto',
            margin: [5, 5, 0, 0],
            table: {
              widths: [200],
              body: [[{ text: '', border: [false, false, false, true] }]]
            }
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
    pageOrientation: 'landscape',
    content: [
      { text: userDetails.naziv_skole, margin: [0, 0, 0, 30] },
      {
        text: `Obračun putnih troškova za ${getMonthName(month)} / ${year}`,
        style: 'header',
        margin: [0, 140, 0, 10],
        alignment: 'center',
        fontSize: 14
      },
      {
        pageBreak: 'after',
        margin: [0, 0, 0, 30],
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            margin: [0, 0, 0, 0],
            table: {
              widths: [100, 100],
              body: [
                [
                  { text: 'Neto', alignment: 'center' },
                  {
                    text: `${numberWithThousandSeparator(netoTotal)}`,
                    alignment: 'right'
                  }
                ],
                [
                  { text: `Neoporezivo`, alignment: 'center' },
                  {
                    text: `${numberWithThousandSeparator(neoporeziviDeoTotal)}`,
                    alignment: 'right'
                  }
                ],
                [
                  { text: 'Oporezivo', alignment: 'center' },
                  {
                    text: `${numberWithThousandSeparator(oporeziviDeoTotal)}`,
                    alignment: 'right'
                  }
                ],
                [
                  { text: 'Bruto', alignment: 'center' },
                  {
                    text: `${numberWithThousandSeparator(
                      brutoOporeziviDeoTotal
                    )}`,
                    alignment: 'right'
                  }
                ],
                [
                  { text: 'Porez', alignment: 'center' },
                  {
                    text: `${numberWithThousandSeparator(porezTotal)}`,
                    alignment: 'right'
                  }
                ]
              ],
              alignment: 'center'
            }
          },
          { width: '*', text: '' }
        ]
      },
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [200, 300, '*', '*', '*', '*'],
          body: [
            [
              { text: 'Prezime i Ime', italics: true, alignment: 'center' },
              {
                table: {
                  widths: [150, 50, 30, '*'],
                  body: [
                    [
                      {
                        text: 'Relacija',
                        border: [false, false, true, false],
                        alignment: 'center',
                        italics: true
                      },
                      {
                        text: 'Cena',
                        border: [true, false, true, false],
                        alignment: 'center',
                        italics: true
                      },
                      {
                        text: 'Dana',
                        border: [true, false, true, false],
                        alignment: 'center',
                        italics: true
                      },
                      {
                        text: 'Neto',
                        border: [true, false, false, false],
                        alignment: 'center',
                        italics: true
                      }
                    ]
                  ]
                },
                layout: { ...zeroPadding }
              },
              { text: 'Neoporezivo', alignment: 'center', italics: true },
              { text: 'Oporezivo', alignment: 'center', italics: true },
              { text: 'Bruto', alignment: 'center', italics: true },
              { text: 'Porez', alignment: 'center', italics: true }
            ],
            ...tableBody()
          ]
        },
        layout: { ...zeroPadding }
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black'
      }
    },
    defaultStyle: {
      // alignment: 'justify'
    }
  };

  let pdfDoc = pdfMake.createPdf(docDefinition).getStream();

  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
}

function createXmlContent(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails,
  userDetails: UserDetails
) {
  let days = daysInMonth(month + 1, year);
  while (!isWeekday(year, month + 1, days)) {
    days--;
  }
  let datumPlacanja = `${year}-${month + 1}-${days}`;
  var xml = builder.create('tns:PodaciPoreskeDeklaracije');
  xml.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  xml.att('xmlns:tns', 'http://pid.purs.gov.rs');
  xml.att('xsi:schemaLocation', 'http://pid.purs.gov.rs');

  let PodaciOPrijavi = xml.ele('tns:PodaciOPrijavi');
  PodaciOPrijavi.ele('tns:KlijentskaOznakaDeklaracije', 1);
  PodaciOPrijavi.ele('tns:VrstaPrijave', 1);
  PodaciOPrijavi.ele('tns:ObracunskiPeriod', `${year}-${month}`);
  PodaciOPrijavi.ele('tns:DatumPlacanja', datumPlacanja);
  PodaciOPrijavi.ele('tns:NajnizaOsnovica', 0);

  let PodaciOIsplatiocu = xml.ele('tns:PodaciOIsplatiocu');
  PodaciOIsplatiocu.ele('tns:TipIsplatioca', 2);
  PodaciOIsplatiocu.ele(
    'tns:PoreskiIdentifikacioniBroj',
    userDetails.poreski_identifikacioni_broj
  );
  PodaciOIsplatiocu.ele(
    'tns:BrojZaposlenih',
    travelingExpense.employees_with_relation.length
  );
  PodaciOIsplatiocu.ele('tns:MaticniBrojisplatioca', userDetails.maticni_broj);
  PodaciOIsplatiocu.ele('tns:NazivPrezimeIme', userDetails.naziv_skole);
  PodaciOIsplatiocu.ele(
    'tns:SedistePrebivaliste',
    userDetails.municipality.code
  );
  PodaciOIsplatiocu.ele('tns:Telefon', userDetails.telefon);
  PodaciOIsplatiocu.ele('tns:UlicaIBroj', userDetails.ulica_i_broj);
  PodaciOIsplatiocu.ele('tns:eMail', userDetails.email);

  let DeklarisaniPrihodi = xml.ele('tns:DeklarisaniPrihodi');

  travelingExpense.employees_with_relation.forEach(
    (employeeWithRelations, i) => {
      let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
        travelingExpense.year,
        travelingExpense.month,
        travelingExpense.maxNonTaxedValue,
        travelingExpense.preracun_na_bruto,
        travelingExpense.stopa
      );
      let calculation = employeeTravelingExpenseCalculator.getCalculation(
        employeeWithRelations
      );

      let PodaciOPrihodima = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');
      PodaciOPrihodima.ele('tns:RedniBroj', i + 1);
      PodaciOPrihodima.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
      PodaciOPrihodima.ele(
        'tns:IdentifikatorPrimaoca',
        employeeWithRelations.employee.jmbg
      );
      PodaciOPrihodima.ele(
        'tns:Prezime',
        employeeWithRelations.employee.last_name
      );
      PodaciOPrihodima.ele(
        'tns:Ime',
        employeeWithRelations.employee.first_name
      );
      PodaciOPrihodima.ele(
        'tns:OznakaPrebivalista',
        employeeWithRelations.employee.municipality.code
      );
      PodaciOPrihodima.ele('tns:SVP', 101110000);
      // PodaciOPrihodima.ele('tns:MesecniFondSati', 168);
      PodaciOPrihodima.ele(
        'tns:Bruto',
        numberWithThousandSeparator(calculation.brutoOporezivo, 2, '')
      );
      PodaciOPrihodima.ele(
        'tns:OsnovicaPorez',
        numberWithThousandSeparator(calculation.oporezivo, 2, '')
      );
      PodaciOPrihodima.ele(
        'tns:Porez',
        numberWithThousandSeparator(calculation.porez, 2, '')
      );
      PodaciOPrihodima.ele('tns:OsnovicaDoprinosi', '0.0');
      PodaciOPrihodima.ele('tns:PIO', '0.0');
      PodaciOPrihodima.ele('tns:ZDR', '0.0');
      PodaciOPrihodima.ele('tns:NEZ', '0.0');
      PodaciOPrihodima.ele('tns:PIOBen', '0.0');
      PodaciOPrihodima.ele('tns:DeklarisaniMFP');
    }
  );

  return xml.end({ pretty: true });
}

function _create_PPP_PD_xmlFile(year: number, month: number) {
  let root = createRootFolder(year, month);
  let filePath = `${root}\\${PUTNI_TROSKOVI_PPP_PD_XML_FILE(year, month)}`;
  fs.writeFile(filePath, '', (e: any) => {
    console.log(e);
  });

  return filePath;
}

function _createPdfFile(year: number, month: number) {
  let root = createRootFolder(year, month);
  let filePath = `${root}\\${PUTNI_TROSKOVI_PDF_FILE(year, month)}`;
  fs.writeFile(filePath, '', (e: any) => {
    console.log(e);
  });

  return filePath;
}
function createRootFolder(year: number, month: number) {
  if (!fs.existsSync(`C:\\${ROOT_DIR}`)) fs.mkdir(`C:\\${ROOT_DIR}`, () => {});

  if (!fs.existsSync(`C:\\${ROOT_DIR}\\${year}`))
    fs.mkdir(`C:\\${ROOT_DIR}\\${year}`, () => {});

  if (!fs.existsSync(`C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}`))
    fs.mkdir(`C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}`, () => {});

  if (
    !fs.existsSync(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\`
    )
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`,
      () => {}
    );

  if (
    !fs.existsSync(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\`
    )
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}`,
      () => {}
    );

  if (
    !fs.existsSync(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${month}`
    )
  )
    fs.mkdir(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${month}`,
      (e: any) => {
        console.log(e);
      }
    );

  return `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${month}`;
}
