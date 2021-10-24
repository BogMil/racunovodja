import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../constants/routes.json';

export default function Home() {
  return (
    <Container className="noselect">
      <Row style={{ marginTop: 10 }} className={`justify-content-md-center`}>
        <Col>
          <h2>Dobrodošli u informacioni sistem "Računovođa"!</h2>
        </Col>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Col className="d-flex justify-content-center">
          <NavLink to={routes.DOSTAVLJAC_MAILOVA_V2}>
            <div className="d-flex justify-content-center">
              <Button>
                <i className="fa fa-paper-plane" />
              </Button>
            </div>
            <div className="d-flex justify-content-right">
              <h3>Slanje platnih listića</h3>
            </div>
          </NavLink>
        </Col>
        <Col className="d-flex justify-content-center">
          <NavLink to={routes.DOSTAVLJAC_MAILOVA}>
            <div className="d-flex justify-content-center">
              <Button>
                <i className="fa fa-paper-plane" />
              </Button>
            </div>
            <div className="d-flex justify-content-center">
              <h3>Slanje obustava</h3>
            </div>
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
}
