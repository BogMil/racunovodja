import React, { ChangeEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import AuthenticationCard from '../components/authenticationCard';
import { useHistory } from 'react-router-dom';
import * as Service from '../auth.service';
import ErrorsBase from '../../../utils/errors';
import { handleResponse, onFailDefault } from '../../../utils/responseHandler';

class Errors extends ErrorsBase {
  email: any = null;
  password: any = null;
  naziv: any = null;
  grad: any = null;
  ulica_i_broj: any = null;
  telefon: any = null;
}

export type NoviKorisnik = {
  email: string;
  password: string;
  naziv: string;
  grad: string;
  ulica_i_broj: string;
  password_confirmation: string;
  telefon: string;
};

export default function Register() {
  let history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [naziv, setName] = useState('');
  const [grad, setCity] = useState('');
  const [ulica_i_broj, setStreet] = useState('');
  const [telefon, setTelefon] = useState('');

  const [errors, setErrors] = useState<Errors>(new Errors());

  const register = async () => {
    // if (!isValid()) return;

    let newUser: NoviKorisnik = {
      email,
      password,
      password_confirmation: passwordConfirm,
      naziv,
      grad,
      ulica_i_broj,
      telefon
    };

    handleResponse(
      await Service.register(newUser),
      () => {
        history.push({
          pathname: routes.SUCCESS_REGISTRATION,
          state: { trialPeriod: response.data }
        });
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
    <AuthenticationCard width={500}>
      <Form>
        <Form.Group>
          <Form.Label>Naziv ustanove</Form.Label>
          <Form.Control
            placeholder="Unesite naziv ustanove"
            value={naziv}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.currentTarget.value);
            }}
          />
          <ErrorText text={errors.naziv} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Grad</Form.Label>
          <Form.Control
            placeholder="Unesite naziv grada"
            value={grad}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCity(e.currentTarget.value);
            }}
          />
          <ErrorText text={errors.grad} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ulica i broj</Form.Label>
          <Form.Control
            placeholder="Unesite naziv ulice i broj"
            value={ulica_i_broj}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setStreet(e.currentTarget.value);
            }}
          />
          {<ErrorText text={errors.ulica_i_broj} />}
        </Form.Group>
        <Form.Group>
          <Form.Label>Telefon</Form.Label>
          <Form.Control
            placeholder="Unesite kontakt telefon"
            value={telefon}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setTelefon(e.currentTarget.value);
            }}
          />
          {<ErrorText text={errors.telefon} />}
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            placeholder="Unesite email adresu"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.currentTarget.value);
            }}
          />
          {<ErrorText text={errors.email} />}
        </Form.Group>
        <Form.Group>
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
        <Form.Group>
          <Form.Label>Ponovi Lozinku</Form.Label>
          <Form.Control
            type="password"
            placeholder="Lozinka"
            value={passwordConfirm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPasswordConfirm(e.currentTarget.value);
            }}
          />
          {errors && <ErrorText text={errors.password} />}
        </Form.Group>
        <Button variant="primary" onClick={() => register()}>
          Registruj se
        </Button>
        <NavLink exact to={routes.LOGIN} style={{ float: 'right' }}>
          Prijavi se
        </NavLink>
      </Form>
    </AuthenticationCard>
  );
}

function ErrorText(props: { text: string }) {
  return (
    <span style={{ color: 'red', fontSize: 11, lineHeight: '2px' }}>
      {props.text}
    </span>
  );
}
