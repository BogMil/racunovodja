import {
  ROOT_DIR,
  DODATNI_PRIHODI_DIR,
  PUTNI_TROSKOVI_DIR,
  PUTNI_TROSKOVI_PPP_PD_FILE
} from '../../constants/files';
import { Employee } from '../employees/types';
var fs = require('fs');
const { shell } = require('electron');
var builder = require('xmlbuilder');

export function create_PPP_PD_File(
  year: number,
  month: number,
  employees: Employee[]
) {

  let filePath =create_PPP_PD_xmlFile(year,month);
  let xmlContent=createXmlContent(year,month,employees);
  fs.writeFile(
    filePath,
    xmlContent,
    (e: any) => {
      console.log(e);
    }
  );
}

function createXmlContent(year:number,month:number,employees:Employee[]){

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
    PodaciOIsplatiocu.ele('tns:BrojZaposlenih', employees.length);
    PodaciOIsplatiocu.ele('tns:MaticniBrojisplatioca', '0825740');
    PodaciOIsplatiocu.ele('tns:NazivPrezimeIme', 'SSŠ Vasa Pelagić');
    PodaciOIsplatiocu.ele('tns:SedistePrebivaliste', 217);
    PodaciOIsplatiocu.ele('tns:Telefon', '013 742 200');
    PodaciOIsplatiocu.ele('tns:UlicaIBroj', 'Cara Lazara 261');
    PodaciOIsplatiocu.ele('tns:eMail', 'vpkovin@gmail.com');

    let DeklarisaniPrihodi = xml.ele('tns:DeklarisaniPrihodi');

    employees.forEach((employee,i)=>{
    let PodaciOPrihodima = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');
    PodaciOPrihodima.ele('tns:RedniBroj', i+1);
    PodaciOPrihodima.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima.ele('tns:IdentifikatorPrimaoca', employee.jmbg);
    PodaciOPrihodima.ele('tns:Prezime', employee.last_name);
    PodaciOPrihodima.ele('tns:Ime', employee.first_name);
    PodaciOPrihodima.ele('tns:OznakaPrebivalista', employee.municipality.code);
    PodaciOPrihodima.ele('tns:SVP', 105602000);
    PodaciOPrihodima.ele('tns:MesecniFondSati', 168);
    PodaciOPrihodima.ele('tns:Bruto', 3378.0);
    PodaciOPrihodima.ele('tns:OsnovicaPorez', 3378.0);
    PodaciOPrihodima.ele('tns:Porez', 338.0);
    PodaciOPrihodima.ele('tns:OsnovicaDoprinosi', '0.0');
    PodaciOPrihodima.ele('tns:PIO', '0.0');
    PodaciOPrihodima.ele('tns:ZDR', '0.0');
    PodaciOPrihodima.ele('tns:NEZ', '0.0');
    PodaciOPrihodima.ele('tns:PIOBen', '0.0');
    PodaciOPrihodima.ele('tns:DeklarisaniMFP');
    })
    let PodaciOPrihodima1 = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');

    PodaciOPrihodima1.ele('tns:RedniBroj', 1);
    PodaciOPrihodima1.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima1.ele('tns:IdentifikatorPrimaoca', '0204986865068');
    PodaciOPrihodima1.ele('tns:Prezime', 'Kosovac');
    PodaciOPrihodima1.ele('tns:Ime', 'Katarina');
    PodaciOPrihodima1.ele('tns:OznakaPrebivalista', 217);
    PodaciOPrihodima1.ele('tns:SVP', 105602000);
    PodaciOPrihodima1.ele('tns:MesecniFondSati', 168);
    PodaciOPrihodima1.ele('tns:Bruto', 3378.0);
    PodaciOPrihodima1.ele('tns:OsnovicaPorez', 3378.0);
    PodaciOPrihodima1.ele('tns:Porez', 338.0);
    PodaciOPrihodima1.ele('tns:OsnovicaDoprinosi', '0.0');
    PodaciOPrihodima1.ele('tns:PIO', '0.0');
    PodaciOPrihodima1.ele('tns:ZDR', '0.0');
    PodaciOPrihodima1.ele('tns:NEZ', '0.0');
    PodaciOPrihodima1.ele('tns:PIOBen', '0.0');
    PodaciOPrihodima1.ele('tns:DeklarisaniMFP');

    let PodaciOPrihodima2 = DeklarisaniPrihodi.ele('tns:PodaciOPrihodima');

    PodaciOPrihodima2.ele('tns:RedniBroj', 2);
    PodaciOPrihodima2.ele('tns:VrstaIdentifikatoraPrimaoca', 1);
    PodaciOPrihodima2.ele('tns:IdentifikatorPrimaoca', 1705991862517);
    PodaciOPrihodima2.ele('tns:Prezime', 'Čolaković');
    PodaciOPrihodima2.ele('tns:Ime', 'Dušan');
    PodaciOPrihodima2.ele('tns:OznakaPrebivalista', '022');
    PodaciOPrihodima2.ele('tns:SVP', 101110000);
    PodaciOPrihodima2.ele('tns:MesecniFondSati', 168);
    PodaciOPrihodima2.ele('tns:Bruto', 2489);
    PodaciOPrihodima2.ele('tns:OsnovicaPorez', 2489);
    PodaciOPrihodima2.ele('tns:Porez', 249);
    PodaciOPrihodima2.ele('tns:OsnovicaDoprinosi', 0);
    PodaciOPrihodima2.ele('tns:PIO', 0);
    PodaciOPrihodima2.ele('tns:ZDR', 0);
    PodaciOPrihodima2.ele('tns:NEZ', 0);
    PodaciOPrihodima2.ele('tns:PIOBen', 0);
    PodaciOPrihodima2.ele('tns:DeklarisaniMFP');

    let doc = xml.end({ pretty: true });
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
