import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_XML_FILE,
  PUTNI_TROSKOVI_PDF_FILE,
  NALOZI_ZA_PRENOS_PDF_FILE,
  mk_PUTNI_TROSKOVI_DIR
} from '../../constants/files';
import {
  EmployeeWithRelations,
  TravelingExpenseWithDetails,
  EmployeeTravelingExpenseCalculator
} from './travelingExpenses.types';
import { numberWithThousandSeparator } from '../../utils/numberWithThousandSeparator';
import getMonthName from '../../utils/getMonthName';
import { UserDetails } from '../userDetails/userDetails.types';
import {
  daysInMonth,
  isWeekday,
  getBusinesDaysInMonth
} from '../../utils/getBusinessDaysInMonth';
import { PodaciONalogu } from './components/details/components/kreirajNalogeZaPrenosModal/kreirajNalogeZaPrenosModal.reducer';
import { ObavezanPodatakNijeSetovanException } from '../../services/pdfParser/exceptions/obavezanPodatakNijeSetovanException';
const { dialog, getCurrentWindow } = require('electron').remote;

var fs = require('fs');
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
    if (e == null) {
      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Računovođa',
        message: 'PPP PD prijava je uspešno kreirana',
        type: 'info'
      });
    }
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

  dialog.showMessageBox(getCurrentWindow(), {
    title: 'Računovođa',
    message: 'PDF fajl je uspešno kreiran',
    type: 'info'
  });
}

function createXmlContent(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails,
  userDetails: UserDetails
) {
  let monthZaDatumPlacanja = month - 1 == 0 ? 12 : month + 1;
  let monthZaDatumPlacanjaStr = monthZaDatumPlacanja.toString();
  let monthZaDatumPlacanjaStrFromat =
    monthZaDatumPlacanjaStr.length == 1
      ? '0' + monthZaDatumPlacanjaStr
      : monthZaDatumPlacanjaStr;

  let monthZaObracunskiPeriod = month - 1 == 0 ? 12 : month;

  let monthZaObracunskiPeriodStr = monthZaObracunskiPeriod.toString();
  let monthZaObracunskiPeriodStrFromat =
    monthZaObracunskiPeriodStr.length == 1
      ? '0' + monthZaObracunskiPeriodStr
      : monthZaObracunskiPeriodStr;

  let days = daysInMonth(monthZaDatumPlacanja, year);
  while (!isWeekday(year, month + 1, days)) {
    days--;
  }

  let daysStr = days.toString();
  let daysStrFormat = daysStr.length == 1 ? '0' + daysStr : daysStr;

  let datumPlacanja = `${year}-${monthZaDatumPlacanjaStrFromat}-${daysStrFormat}`;
  var xml = builder.create('tns:PodaciPoreskeDeklaracije');
  xml.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
  xml.att('xmlns:tns', 'http://pid.purs.gov.rs');
  xml.att('xsi:schemaLocation', 'http://pid.purs.gov.rs');

  let PodaciOPrijavi = xml.ele('tns:PodaciOPrijavi');
  PodaciOPrijavi.ele('tns:KlijentskaOznakaDeklaracije', 1);
  PodaciOPrijavi.ele('tns:VrstaPrijave', 1);
  PodaciOPrijavi.ele(
    'tns:ObracunskiPeriod',
    `${year}-${monthZaObracunskiPeriodStrFromat}`
  );
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
  let redniBroj = 1;
  travelingExpense.employees_with_relation.forEach(employeeWithRelations => {
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

    if (calculation.porez == 0) return;

    let PodaciOPrihodima = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');
    PodaciOPrihodima.ele('tns:RedniBroj', redniBroj);
    redniBroj++;
    PodaciOPrihodima.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima.ele(
      'tns:IdentifikatorPrimaoca',
      employeeWithRelations.employee.jmbg
    );
    PodaciOPrihodima.ele(
      'tns:Prezime',
      employeeWithRelations.employee.last_name
    );
    PodaciOPrihodima.ele('tns:Ime', employeeWithRelations.employee.first_name);
    PodaciOPrihodima.ele(
      'tns:OznakaPrebivalista',
      employeeWithRelations.employee.municipality.code
    );
    PodaciOPrihodima.ele('tns:SVP', 101110000);
    PodaciOPrihodima.ele(
      'tns:MesecniFondSati',
      getBusinesDaysInMonth(monthZaObracunskiPeriod, year) * 8
    );
    PodaciOPrihodima.ele(
      'tns:Bruto',
      numberWithThousandSeparator(calculation.brutoOporezivo, 2, '')
    );
    PodaciOPrihodima.ele(
      'tns:OsnovicaPorez',
      numberWithThousandSeparator(calculation.brutoOporezivo, 2, '')
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
  });

  return xml.end({ pretty: true });
}

function _create_PPP_PD_xmlFile(year: number, month: number) {
  let root = mk_PUTNI_TROSKOVI_DIR(year, month);
  let filePath = `${root}\\${PUTNI_TROSKOVI_PPP_PD_XML_FILE(year, month)}`;
  fs.writeFile(filePath, '', () => {});

  return filePath;
}

function _createPdfFile(year: number, month: number) {
  let root = mk_PUTNI_TROSKOVI_DIR(year, month);
  let filePath = `${root}\\${PUTNI_TROSKOVI_PDF_FILE(year, month)}`;
  fs.writeFile(filePath, '', () => {});

  return filePath;
}

function _createVirmaniPdfFile(year: number, month: number) {
  let root = mk_PUTNI_TROSKOVI_DIR(year, month);
  let filePath = `${root}\\${NALOZI_ZA_PRENOS_PDF_FILE(year, month)}`;
  fs.writeFile(filePath, '', () => {});

  return filePath;
}

function getTipSkole(userDetails: UserDetails) {
  switch (userDetails.tip_skole) {
    case 0:
      return '921';
    case 1:
      return '920';
    default:
      throw new ObavezanPodatakNijeSetovanException(
        'Tip škole nije definisan.'
      );
  }
}

function getSifraSkole(userDetails: UserDetails) {
  if (userDetails.sifra_skole != '' && userDetails.sifra_skole != null)
    return userDetails.sifra_skole;
  else
    throw new ObavezanPodatakNijeSetovanException(
      'Šifra škole nije definisana.'
    );
}

function mod97(br: string, os: number) {
  var c,
    x,
    kb = 0;

  for (x = br.length - 1; !(x < 0); x--) {
    c = parseInt(br.charAt(x));
    kb = (kb + os * c) % 97;
    os = (os * 10) % 97;
  }

  kb = 98 - kb;

  return kb;
}

export async function createVirmaniPdfFile(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails,
  userDetails: UserDetails,
  podaciONalogu: PodaciONalogu
) {
  let konto = '415112';
  let tipSkole = getTipSkole(userDetails);
  let sifraSkole = getSifraSkole(userDetails);

  let kontrolniBroj = mod97(
    `${sifraSkole}${konto}00${podaciONalogu.izvorPrihoda}${tipSkole}`,
    100
  );

  let pozivNaBrojZaduzenje = `${kontrolniBroj}-${sifraSkole}-${konto}-00-${podaciONalogu.izvorPrihoda}-${tipSkole}`;

  let filePath = _createVirmaniPdfFile(year, month);
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

  const topBottomPadding = {
    paddingLeft: function() {
      return 0;
    },
    paddingRight: function() {
      return 0;
    },
    paddingTop: function() {
      return 0.5;
    },
    paddingBottom: function() {
      return 0.5;
    }
  };

  const noBorders = [false, false, false, false];
  const thinTableBorders = {
    hLineWidth: function() {
      return 0.5;
    },
    vLineWidth: function() {
      return 0.05;
    }
  };

  type NalogProps = {
    platilac: string;
    primalac: string;
    iznos: string;
    racunPrimaoca: string;
  };

  let nalog = (props: NalogProps, i: number) => [
    {
      pageBreak: i % 3 == 0 ? 'after' : '',
      stack: [
        {
          text: 'НАЛОГ ЗА ПРЕНОС',
          bold: true,
          alignment: 'right',
          fontSize: 14
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  border: [false, false, true, false],
                  margin: [0, 0, 20, 0],

                  stack: [
                    { text: 'платилац', style: 'labels' },
                    {
                      table: {
                        widths: ['*'],
                        heights: [35],
                        body: [[props.platilac]]
                      },
                      layout: { ...thinTableBorders }
                    },
                    { text: 'сврха плаћања', style: 'labels' },
                    {
                      table: {
                        widths: ['*'],
                        heights: [35],
                        body: [['Друга лична примања запослених']]
                      },
                      layout: { ...thinTableBorders }
                    },
                    //
                    { text: 'прималац', style: 'labels' },
                    {
                      table: {
                        widths: ['*'],
                        heights: [35],
                        body: [[props.primalac]]
                      },
                      layout: { ...thinTableBorders }
                    }
                  ]
                },
                {
                  border: noBorders,
                  margin: [20, 0, 0, 0],

                  stack: [
                    {
                      table: {
                        widths: [40, 10, 40, 10, '*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'шифра \nплаћања',
                              style: 'labels',
                              border: noBorders
                            },
                            { text: '', border: noBorders },
                            {
                              text: 'валута',
                              style: 'labels',
                              margin: [0, 10, 0, 0],
                              border: noBorders
                            },
                            { text: '', border: noBorders },
                            {
                              text: 'износ',
                              style: 'labels',
                              margin: [0, 10, 0, 0],
                              border: noBorders
                            }
                          ],
                          [
                            { text: '242', alignment: 'center' },
                            { text: '', border: noBorders },
                            { text: 'РСД', alignment: 'center' },
                            { text: '', border: noBorders },
                            { text: props.iznos, alignment: 'right' }
                          ]
                        ]
                      },
                      layout: { ...thinTableBorders, ...topBottomPadding }
                    },

                    {
                      table: {
                        widths: ['*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'рачун платиоца',
                              style: 'labels',
                              border: noBorders
                            }
                          ],
                          [
                            {
                              text: userDetails.bankovni_racun,
                              alignment: 'center'
                            }
                          ]
                        ]
                      },
                      layout: { ...thinTableBorders, ...topBottomPadding }
                    },
                    {
                      table: {
                        widths: [40, 10, '*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'позив на број (задужење)',
                              style: 'labels',
                              border: noBorders,
                              colSpan: 3
                            },
                            {},
                            {}
                          ],
                          [
                            { text: '97', alignment: 'center' },
                            { text: '', border: noBorders },
                            { text: pozivNaBrojZaduzenje, alignment: 'center' }
                          ]
                        ]
                      },
                      layout: { ...thinTableBorders, ...topBottomPadding }
                    },

                    {
                      table: {
                        widths: ['*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'рачун примаоца',
                              style: 'labels',
                              border: noBorders
                            }
                          ],
                          [{ text: props.racunPrimaoca, alignment: 'center' }]
                        ]
                      },
                      layout: { ...thinTableBorders, ...topBottomPadding }
                    },

                    {
                      table: {
                        widths: [40, 10, '*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'позив на број (одобрење)',
                              style: 'labels',
                              border: noBorders,
                              colSpan: 3
                            },
                            {},
                            {}
                          ],
                          [
                            { text: '97', alignment: 'center' },
                            { text: '', border: noBorders },
                            {
                              text: podaciONalogu.pozivNaBrojOdobrenje,
                              alignment: 'center'
                            }
                          ]
                        ]
                      },
                      layout: { ...thinTableBorders, ...topBottomPadding }
                    }
                  ]
                }
              ]
            ]
          },
          layout: { ...zeroPadding, ...thinTableBorders }
        },
        {
          margin: [0, 0, 0, 0],
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  border: noBorders,
                  margin: [0, 0, 20, 0],

                  stack: [
                    {
                      margin: [0, 15, 0, 0],
                      table: {
                        widths: [30, 100, '*'],
                        heights: [10],
                        body: [
                          [
                            {
                              text: 'печат и потпис платиоца/примаоца',
                              colSpan: 2,
                              style: 'labels',
                              border: [false, true, false, false]
                            },
                            {},
                            { text: '', border: noBorders }
                          ],
                          [
                            {
                              text: '',
                              border: noBorders,
                              margin: [0, 10, 0, 0]
                            },
                            {
                              text: `${
                                userDetails.mesto
                              } , ${podaciONalogu.datumPrijema.getDate()}.${podaciONalogu.datumPrijema.getMonth() +
                                1}.${podaciONalogu.datumPrijema.getFullYear()}`,
                              colSpan: 2,
                              fontSize: 10,
                              alignment: 'center',
                              border: [false, false, false, true]
                            }
                          ],
                          [
                            {
                              text: '',
                              border: noBorders,
                              margin: [0, 10, 0, 0]
                            },
                            {
                              text: 'место и датум пријема',
                              style: 'labels',
                              alignment: 'center',
                              colSpan: 2,
                              border: noBorders
                            }
                          ]
                        ]
                      },
                      layout: { ...thinTableBorders }
                    }
                  ]
                },
                {
                  margin: [20, 33, 0, 0],
                  border: noBorders,
                  table: {
                    widths: [100],
                    heights: [10],
                    body: [
                      [
                        {
                          text: `${podaciONalogu.datumIzvrsenja.getDate()}.${podaciONalogu.datumIzvrsenja.getMonth() +
                            1}.${podaciONalogu.datumIzvrsenja.getFullYear()}`,
                          alignment: 'center',
                          fontSize: 10,
                          border: noBorders
                        }
                      ],
                      [
                        {
                          text: 'датум извршења',
                          alignment: 'center',
                          style: 'labels',
                          border: [false, true, false, false]
                        }
                      ]
                    ]
                  },
                  layout: { ...thinTableBorders, ...topBottomPadding }
                }
              ]
            ]
          },
          layout: { ...zeroPadding }
        },
        { text: 'Образац бр. 3', alignment: 'center', style: 'labels' },
        {
          margin: [0, 10, 0, 10],
          table: {
            widths: ['*'],
            body: [[{ text: '', border: [false, true, false, false] }]]
          },
          layout: { ...thinTableBorders }
        }
      ]
    }
  ];

  let employeeTravelingExpenseCalculator = new EmployeeTravelingExpenseCalculator(
    travelingExpense.year,
    travelingExpense.month,
    travelingExpense.maxNonTaxedValue,
    travelingExpense.preracun_na_bruto,
    travelingExpense.stopa
  );

  let nalozi = travelingExpense.employees_with_relation.map(
    (employeeWithRelation, i) => {
      let calculation = employeeTravelingExpenseCalculator.getCalculation(
        employeeWithRelation
      );

      let _nalog = nalog(
        {
          platilac: userDetails.naziv_skole,
          primalac:
            employeeWithRelation.employee.last_name +
            ' ' +
            employeeWithRelation.employee.first_name,
          iznos: numberWithThousandSeparator(calculation.neto),
          racunPrimaoca: employeeWithRelation.employee.banc_account
        },
        i + 1
      );

      return _nalog;
    }
  );

  var docDefinition = {
    pageSize: 'A4',
    pageMargins: [20, 10, 20, 0],

    content: nalozi,
    styles: {
      labels: {
        fontSize: 8,
        color: 'black'
      }
    }
  };

  let pdfDoc = pdfMake.createPdf(docDefinition).getStream();

  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
}
