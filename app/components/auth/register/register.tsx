import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json'
import AuthenticationCard from '../components/authenticationCard';
import { useHistory } from "react-router-dom";

export default function Register() {
  let history=useHistory();

  const register=()=>{
    history.push(
      {
        pathname: routes.SUCCESS_REGISTRATION,
        state: { trialPeriod:"6 meseci" }
      })
  }

  return(
    <AuthenticationCard>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email adresa</Form.Label>
          <Form.Control type="email" placeholder="Unesite email adresu" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Lozinka</Form.Label>
          <Form.Control type="password" placeholder="Lozinka" />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Ponovi Lozinku</Form.Label>
          <Form.Control type="password" placeholder="Lozinka" />
        </Form.Group>
        <Button variant="primary" onClick={()=>register()}>
          Registruj se
        </Button>
        <NavLink exact to ={routes.LOGIN} style={{float:'right'}}>
          Prijavi se
        </NavLink>
      </Form>
    </AuthenticationCard>
  );
}
