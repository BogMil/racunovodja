import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json'
import AuthenticationCard from '../components/authenticationCard';
import {useDispatch} from 'react-redux';
import { setAuthenticated } from '../auth.actions';
import {useHistory} from 'react-router-dom'
export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin=()=>{
    dispatch(setAuthenticated());
    history.push(routes.HOME);
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
        <Button variant="primary" onClick={()=>onLogin()}>
          Prijavi se
        </Button>
        <NavLink exact to ={routes.REGISTER} style={{float:'right'}}>
          Registuj se
        </NavLink>
      </Form>
    </AuthenticationCard>
  );
}
