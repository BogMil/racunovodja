import React from 'react';
import {  Container, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json'
import { useLocation} from "react-router-dom";

export default function Success() {
  let {trialPeriod} = useLocation().state;
  return(
    <Container>
      <Row style={{marginTop:50}}>
        <h2>
          Uspešno ste se registrovali za korišćenje aplikacije "Računovođa"!
        </h2>
        <h2>
          Na raspolaganju vam je {trialPeriod} probnog perioda!
        </h2>
      </Row>

      <Row style={{marginTop:50}} className={`justify-content-md-center`}>
        <NavLink to={routes.LOGIN}>
          <h3>Prijavi se</h3>
        </NavLink>
      </Row>
    </Container>
  );
}
