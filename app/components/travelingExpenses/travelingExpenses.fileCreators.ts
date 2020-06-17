import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_XML_FILE,
  PUTNI_TROSKOVI_PDF_FILE
} from '../../constants/files';
import { EmployeeWithRelations, TravelingExpense, TravelingExpenseWithDetails, EmployeeTravelingExpenseCalculator } from './travelingExpenses.types';
import { numberWithThousandSeparator } from '../../utils/numberWithThousandSeparator';
import getMonthName from '../../utils/getMonthName';
import SourceSansProLight from '../../../resources/fonts/SourceSansProLight-KGKA.ttf';
import Axios from 'axios';



var fs = require('fs');
const { shell } = require('electron');
var builder = require('xmlbuilder');

export function create_PPP_PD_XML_File(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails
) {

  let filePath =_create_PPP_PD_xmlFile(year,month);
  let xmlContent=createXmlContent(year,month,travelingExpense);
  fs.writeFile(
    filePath,
    xmlContent,
    (e: any) => {
      console.log(e);
    }
  );
}



export async function createPdfFile(year: number,month: number,
  travelingExpense: TravelingExpenseWithDetails){
    let filePath =_createPdfFile(year,month);
    const fs = require('fs');
    let pdfMake =require('pdfmake/build/pdfmake');
    let pdfFonts =require("pdfmake/build/vfs_fonts");
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    // let x=travelingExpense.employees_with_relation.map(e=>{
    //   let arr=[];
    //   arr[0]=e.employee.jmbg;
    //   arr[1]=e.employee.last_name + ' ' + e.employee.last_name;

    // })

let multipleRelations =()=>[
[ {text:'Bogdanovic Jelka',rowSpan:2},
[
  {
    table: {
      widths:[150,50,30,'*'],
      body: [
        [
          {
            text:'lokal',
            border: [false, false, true, false],
          },
          {
            text: '0,000.00',
            border: [true, false, true, false],
            alignment:'right'
          },
          {
            text: '00',
            border: [true, false, true, false],
            alignment:'center'
          },
          {
            text: '00,000.00',
            border: [true, false, false, false],
            alignment:'right'
          },
        ],
        [
          {
            text:'lokal',
            border: [false, true, true, false],
          },
          {
            text: '0,000.00',
            border: [true, true, true, false],
            alignment:'right'
          },
          {
            text: '00',
            border: [true, true, true, false],
            alignment:'center'
          },
          {
            text: '00,000.00',
            border: [true, true, false, false],
            alignment:'right'
          },
        ]
      ],
    },
    layout: {
      paddingLeft: function(i, node) { return 0; },
      paddingRight: function(i, node) { return 0; },
      paddingTop: function(i, node) { return 0; },
      paddingBottom: function(i, node) { return 0; },
    }
  }
],
{
  text: '',
  alignment:'right'
},
{
  text: '',
  alignment:'right'
},
{
  text: '',
  alignment:'right'
},
{
  text: '',
  alignment:'right'
},
],
  ["",
  [
    {
      table: {
        widths:[232,'*'],
        body: [
          [
            {
              text:'',
              border: [false, false, true, false],
            },
            {
              text: '00,000.00',
              border: [true, false, false, false],
              alignment:'right'
            },
          ],
        ],
      },
      layout: {
        // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
        // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
        paddingLeft: function(i, node) { return 0; },
        paddingRight: function(i, node) { return 0; },
        paddingTop: function(i, node) { return 0; },
        paddingBottom: function(i, node) { return 0; },
        // fillColor: function (rowIndex, node, columnIndex) { return null; }
      }
    }
  ],
  {
    text: '00,000.00',
    alignment:'right'
  },
  {
    text: '00,000.00',
    alignment:'right'
  },
  {
    text: '00,000.00',
    alignment:'right'
  },
  {
    text: '00,000.00',
    alignment:'right'
  },
  ]
];

    var docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',

  pageMargins: [ 10, 5,10,5 ],
      content: [
        {
          text: `Obračun putnih troškova za ${getMonthName(month)} / ${year}`,
          style: 'header',
          alignment: 'center',
          fontSize:12
        },
        {
          style: 'tableExample',

          table: {
            widths: [200, 300, '*', '*', '*','*'],
            body: [
              [
                {text:'Prezime i Ime', italics: true},
                // {text:'asd',colSpan:4},{}
                [
                  {
                    table: {
                      widths:[150,50,30,'*'],
                      body: [
                        [{
                          text:'Relacija',
                          border: [false, false, true, false],
                          alignment:'center',
                          italics: true

                        },
                        {
                          text: 'Cena',
                          border: [true, false, true, false],
                          alignment:'center',
                          italics: true
                        },
                        {
                          text: 'Dana',
                          border: [true, false, true, false],
                          alignment:'center',
                          italics: true
                        },
                        {
                          text: 'Neto',
                          border: [true, false, false, false],
                          alignment:'center',
                          italics: true
                        },
                        ]
                      ],
                    },
                    layout: {
                      // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                      // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                      paddingLeft: function(i, node) { return 0; },
                      paddingRight: function(i, node) { return 0; },
                      paddingTop: function(i, node) { return 0; },
                      paddingBottom: function(i, node) { return 0; },
                      // fillColor: function (rowIndex, node, columnIndex) { return null; }
                    }
                  }
                ],
                {text:'Neoporezivo',alignment:'center',italics: true},
                {text:'Oporezivo',alignment:'center',italics: true},
                {text:'Bruto',alignment:'center',italics: true},
                {text:'Porez',alignment:'center',italics: true}
              ],
              ////////////////////////////////////////////////////////////////////////////////////////////MR
...multipleRelations(),
...multipleRelations(),
...multipleRelations(),
...multipleRelations(),...multipleRelations(),
...multipleRelations(),...multipleRelations(),
...multipleRelations(),
...multipleRelations(),
...multipleRelations(),
...multipleRelations(),...multipleRelations(),
...multipleRelations(),...multipleRelations(),
...multipleRelations(),
              ////////////////////////////////////////////////////////////////////////////////////////////MR

            ]
          },
          layout: {
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            paddingLeft: function(i, node) { return 0; },
            paddingRight: function(i, node) { return 0; },
            paddingTop: function(i, node) { return 0; },
            paddingBottom: function(i, node) { return 0; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        },
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

    let pdfDoc=pdfMake.createPdf(docDefinition)
    .getStream();

    pdfDoc.pipe(fs.createWriteStream(filePath));
    pdfDoc.end();
  }

function createXmlContent(year:number,month:number,travelingExpense:TravelingExpenseWithDetails){

  var xml = builder.create('tns:PodaciPoreskeDeklaracije');
    xml.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    xml.att('xmlns:tns', 'http://pid.purs.gov.rs');
    xml.att('xsi:schemaLocation', 'http://pid.purs.gov.rs');

    let PodaciOPrijavi = xml.ele('tns:PodaciOPrijavi');
    PodaciOPrijavi.ele('tns:KlijentskaOznakaDeklaracije', 1);
    PodaciOPrijavi.ele('tns:VrstaPrijave', 1);
    PodaciOPrijavi.ele('tns:ObracunskiPeriod', `${year}-${month}`);
    PodaciOPrijavi.ele('tns:DatumPlacanja', '2020-06-10');
    PodaciOPrijavi.ele('tns:NajnizaOsnovica', 0);

    let PodaciOIsplatiocu = xml.ele('tns:PodaciOIsplatiocu');
    PodaciOIsplatiocu.ele('tns:TipIsplatioca', 2);
    PodaciOIsplatiocu.ele('tns:PoreskiIdentifikacioniBroj', 101408574);
    PodaciOIsplatiocu.ele('tns:BrojZaposlenih', travelingExpense.employees_with_relation.length);
    PodaciOIsplatiocu.ele('tns:MaticniBrojisplatioca', '0825740');
    PodaciOIsplatiocu.ele('tns:NazivPrezimeIme', 'SSŠ Vasa Pelagić');
    PodaciOIsplatiocu.ele('tns:SedistePrebivaliste', 217);
    PodaciOIsplatiocu.ele('tns:Telefon', '013 742 200');
    PodaciOIsplatiocu.ele('tns:UlicaIBroj', 'Cara Lazara 261');
    PodaciOIsplatiocu.ele('tns:eMail', 'vpkovin@gmail.com');

    let DeklarisaniPrihodi = xml.ele('tns:DeklarisaniPrihodi');

    travelingExpense.employees_with_relation.forEach((employeeWithRelations,i)=>{
      let employeeTravelingExpenseCalculator=new EmployeeTravelingExpenseCalculator(travelingExpense.year,travelingExpense.month,travelingExpense.maxNonTaxedValue,travelingExpense.preracun_na_bruto,travelingExpense.stopa);
      let calculation =employeeTravelingExpenseCalculator.getCalculation(employeeWithRelations);

      let PodaciOPrihodima = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');
      PodaciOPrihodima.ele('tns:RedniBroj', i+1);
      PodaciOPrihodima.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
      PodaciOPrihodima.ele('tns:IdentifikatorPrimaoca', employeeWithRelations.employee.jmbg);
      PodaciOPrihodima.ele('tns:Prezime', employeeWithRelations.employee.last_name);
      PodaciOPrihodima.ele('tns:Ime', employeeWithRelations.employee.first_name);
      PodaciOPrihodima.ele('tns:OznakaPrebivalista', employeeWithRelations.employee.municipality.code);
      PodaciOPrihodima.ele('tns:SVP', 105602000);
      // PodaciOPrihodima.ele('tns:MesecniFondSati', 168);
      PodaciOPrihodima.ele('tns:Bruto', numberWithThousandSeparator(calculation.brutoOporezivo,2,''));
      PodaciOPrihodima.ele('tns:OsnovicaPorez', numberWithThousandSeparator(calculation.oporezivo,2,''));
      PodaciOPrihodima.ele('tns:Porez', numberWithThousandSeparator(calculation.porez,2,''));
      PodaciOPrihodima.ele('tns:OsnovicaDoprinosi', '0.0');
      PodaciOPrihodima.ele('tns:PIO', '0.0');
      PodaciOPrihodima.ele('tns:ZDR', '0.0');
      PodaciOPrihodima.ele('tns:NEZ', '0.0');
      PodaciOPrihodima.ele('tns:PIOBen', '0.0');
      PodaciOPrihodima.ele('tns:DeklarisaniMFP');
    });


    return xml.end({ pretty: true });
}

function _create_PPP_PD_xmlFile(year:number,month:number){
  let root = createRootFolder(year,month);
  let filePath = `${root}\\${PUTNI_TROSKOVI_PPP_PD_XML_FILE(year,month)}`;
  fs.writeFile(
    filePath,
    '',
    (e: any) => {
      console.log(e);
    }
  );

  return filePath;

}

function _createPdfFile(year:number,month:number){
  let root = createRootFolder(year,month);
  let filePath=`${root}\\${PUTNI_TROSKOVI_PDF_FILE(year,month)}`;
  fs.writeFile(
    filePath,
    '',
    (e: any) => {
      console.log(e);
    }
  );

  return filePath;

}
function createRootFolder(year:number,month:number){
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
