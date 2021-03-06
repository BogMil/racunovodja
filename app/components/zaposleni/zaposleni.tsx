import React, { useEffect } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import EmployeeComponent from './components/employee/employee';
import AddDefaultRealtionModal from './components/addDefaultRelationModal/addDefaultRelationModal';
import EmployeeModal from './components/zaposleniModal/zaposleniModal';
import { useDispatch, useSelector } from 'react-redux';
import { ucitajZaposlene } from './zaposleni.actions';
import { AppStore } from '../../reducers';
import { openCreate } from './components/zaposleniModal/zaposleniModal.actions';
import { open as openDPLEmailSyncModal } from './components/DPLEmailSyncModal/DPLEmailSyncModal.actions';

import UploadFileModal from './components/uploadFileModal/uploadFileModal';
import { open } from './components/uploadFileModal/uploadFileModal.actions';
import { columnWidths } from './zaposleni.columnStyle';
import DPLEmailSyncModal from './components/DPLEmailSyncModal/DPLEmailSyncModal';
import { DPL_DB_FILE } from '../../constants/files';
import { AuthStore } from '../auth/auth.reducer';
import { User } from '../auth/auth.store.types';
const fs = require('fs');

export default function Employees() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.zaposleniPage.employees;
  });

  const { prava_pristupa } = useSelector((state: AppStore) => {
    return state.auth.user as User;
  });

  const postojiDostavljacPlatnihListica = fs.existsSync(DPL_DB_FILE());

  useEffect(() => {
    dispatch(ucitajZaposlene());
  }, []);

  const openCreateDialog = () => {
    dispatch(openCreate());
  };

  const openUploadDialog = () => {
    dispatch(open());
  };

  const _openDPLEmailSyncModal = () => {
    dispatch(openDPLEmailSyncModal());
  };

  return (
    <Container
      fluid
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap'
      }}
      className={`noselect`}
    >
      <Row style={{ flexGrow: 1, overflow: 'auto' }}>
        <Col style={{ padding: 0 }}>
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{
              width: columnWidths.sum(prava_pristupa),
              tableLayout: 'fixed'
            }}
          >
            <thead>
              <tr>
                <th style={{ width: columnWidths.prezime }}>Prezime</th>
                <th style={{ width: columnWidths.ime }}>Ime</th>
                <th style={{ width: columnWidths.email }}>Email</th>
                <th style={{ width: columnWidths.jmbg }}>JMBG</th>
                <th style={{ width: columnWidths.broj }}>Broj</th>
                <th style={{ width: columnWidths.brojRacuna }}>Broj računa</th>
                {prava_pristupa.opiro && (
                  <>
                    <th style={{ width: columnWidths.opstina }}>Opština</th>
                    <th style={{ width: columnWidths.relacije }}>
                      Podrazumevana relacija
                    </th>
                  </>
                )}
                <th
                  style={{ textAlign: 'center', width: columnWidths.actions }}
                >
                  <Button
                    onClick={openCreateDialog}
                    title="Kreiraj novog zaposlenog"
                    variant="success"
                    style={{
                      paddingLeft: 5,
                      paddingRight: 5,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginRight: 5
                    }}
                  >
                    <i className="fa fa-plus" />
                  </Button>
                  <Button
                    title="Učitaj zaposlene iz platnih listića"
                    style={{
                      paddingLeft: 5,
                      paddingRight: 5,
                      marginRight: 5,
                      paddingTop: 0,
                      paddingBottom: 0
                    }}
                    onClick={openUploadDialog}
                  >
                    <i className="fa fa-file-upload" />
                  </Button>
                  {postojiDostavljacPlatnihListica && (
                    <Button
                      title="Povuci email adrese iz Dostavljača platnih listića"
                      style={{
                        backgroundColor: '#201547',
                        paddingLeft: 5,
                        paddingRight: 5,
                        paddingTop: 0,
                        paddingBottom: 0
                      }}
                      onClick={_openDPLEmailSyncModal}
                    >
                      <i className="fa fa-paper-plane" />
                    </Button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {store.employees &&
                store.employees.map((employee, index) => (
                  <EmployeeComponent key={index} zaposleni={employee} />
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <AddDefaultRealtionModal />
      <EmployeeModal />
      <UploadFileModal />
      <DPLEmailSyncModal />
    </Container>
  );
}
