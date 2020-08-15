import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { Row, Col, Button, Container, Table, Tabs, Tab } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../../reducers';
import styles from './detaljiDobavljaca.css';
import * as service from '../../dobavljaci.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { detaljiDobavljacaInitial } from '../../dobavljaci.types';

export default function DobavljacDetaljiComponent() {
  const [detalji, setDetalji] = useState(detaljiDobavljacaInitial());
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.travelingExpensesCombined.travelingExpenseDetails;
  });

  useEffect(() => {
    loadDetalji();
  }, []);

  const loadDetalji = async () => {
    handleResponse(await service.details(parseInt(id)), res =>
      setDetalji(res.data)
    );
  };

  return (
    <Container fluid className={`${styles['details-container']}  noselect`}>
      <div style={{ textAlign: 'center' }}>
        <h4>{detalji.naziv}</h4>
      </div>
      <Tabs defaultActiveKey="osnovniPodaci" id="detalji">
        <Tab eventKey="osnovniPodaci" title="Osnovni podaci">
          <Row>
            <Col>
              Žiro račun : <b>{detalji.ziro_racun}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              PIB : <b>{detalji.pib}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              Adresa : <b>{detalji.adresa}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              kontakt : <b>{detalji.kontakt}</b>
            </Col>
          </Row>
          <Row>
            <Col>
              email : <b>{detalji.email}</b>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
