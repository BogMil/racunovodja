import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_FILE
} from '../../constants/files';
import { EmployeeWithRelations, TravelingExpense, TravelingExpenseWithDetails, EmployeeTravelingExpenseCalculator } from './travelingExpenses.types';
import { numberWithThousandSeparator } from '../../utils/numberWithThousandSeparator';
var fs = require('fs');
const { shell } = require('electron');
var builder = require('xmlbuilder');

export function create_PPP_PD_File(
  year: number,
  month: number,
  travelingExpense: TravelingExpenseWithDetails
) {

  let filePath =create_PPP_PD_xmlFile(year,month);
  let xmlContent=createXmlContent(year,month,travelingExpense);
  fs.writeFile(
    filePath,
    xmlContent,
    (e: any) => {
      console.log(e);
    }
  );
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
function create_PPP_PD_xmlFile(year:number,month:number){
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

    fs.writeFile(
      `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${month}\\${PUTNI_TROSKOVI_PPP_PD_FILE(
        year,
        month
      )}`,
      '',
      (e: any) => {
        console.log(e);
      }
    );

    return `C:\\${ROOT_DIR}\\${year}\\${DODATNI_PRIHODI_DIR}\\${PUTNI_TROSKOVI_DIR}\\${month}\\${PUTNI_TROSKOVI_PPP_PD_FILE(
      year,
      month
    )}`;

}
