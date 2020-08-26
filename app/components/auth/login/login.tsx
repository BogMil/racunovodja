import React, { useState, ChangeEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import AuthenticationCard from '../components/authenticationCard';
import { useDispatch } from 'react-redux';
import { setUser } from '../auth.actions';
import { useHistory } from 'react-router-dom';
import * as Service from '../auth.service';
import { handleResponse, onFailDefault } from '../../../utils/responseHandler';

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    handleResponse(
      await Service.login(email, password),
      (response: any) => {
        dispatch(setUser(response.data.user, response.data.jwt));
        history.push(routes.HOME);
      },
      onFailDefault,
      (response: any) => {
        let { data } = response;
        console.log(data.errors);
        setErrors(data.errors);
      }
    );
  };

  return (
    <AuthenticationCard>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email adresa</Form.Label>
          <Form.Control
            type="email"
            placeholder="Unesite email adresu"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Lozinka</Form.Label>
          <Form.Control
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.currentTarget.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" onClick={() => onLogin()}>
          Prijavi se
        </Button>
        <NavLink exact to={routes.REGISTER} style={{ float: 'right' }}>
          Registuj se
        </NavLink>
      </Form>
    </AuthenticationCard>
  );
}
