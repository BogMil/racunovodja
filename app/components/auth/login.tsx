import React, { useState, ChangeEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../constants/routes.json';
import AuthenticationCard from './components/authenticationCard';
import { useDispatch } from 'react-redux';
import { setUser } from './auth.actions';
import { useHistory } from 'react-router-dom';
import * as Service from './auth.service';
import { handleResponse, onFailDefault } from '../../utils/responseHandler';
import ErrorsBase from '../../utils/errors';
import { setToken } from '../../utils/tokenService';

class Errors extends ErrorsBase {
  email: any = null;
  password: any = null;
  greska: any = null;
}

export default function Login() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>();

  const onLogin = async () => {
    await login();
    await storeKorisnik();
  };

  const storeKorisnik = async () => {
    handleResponse(await Service.me(), (response: any) => {
      dispatch(setUser(response.data.korisnik));
      history.push(routes.HOME);
    });
  };

  const login = async () => {
    handleResponse(
      await Service.login(email, password),
      (response: any) => {
        setToken(response.data.jwt);
      },
      onFailDefault,
      (response: any) => {
        let { data } = response;
        setErrors(data.errors);
      }
    );
  };

  function ErrorText(props: { text: string }) {
    return (
      <span style={{ color: 'red', fontSize: 11, lineHeight: '2px' }}>
        {props.text}
      </span>
    );
  }

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
          <ErrorText text={errors?.email} />
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
          <ErrorText text={errors?.password} />
        </Form.Group>
        <Form.Group>
          <ErrorText text={errors?.greska} />
        </Form.Group>
        <Button variant="primary" onClick={onLogin}>
          Prijavi se
        </Button>
        <NavLink exact to={routes.REGISTER} style={{ float: 'right' }}>
          Registuj se
        </NavLink>
      </Form>
    </AuthenticationCard>
  );
}
