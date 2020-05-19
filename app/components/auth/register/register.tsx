import React, { ChangeEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import routes from '../../../constants/routes.json';
import AuthenticationCard from '../components/authenticationCard';
import { useHistory } from 'react-router-dom';
import * as Service from '../auth.service';
import ErrorsBase from '../../../utils/errors';
import { handleResponse } from '../../../utils/responseHandler';

class Errors extends ErrorsBase {
  email: any = null;
  password: any = null;
  name: any = null;
  city: any = null;
  street: any = null;
}

export class NewUser {
  constructor(
    email: string,
    password: string,
    passwordConfirm: string,
    name: string,
    city: string,
    street: string
  ) {
    this.email = email;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.name = name;
    this.city = city;
    this.street = street;
  }
  email: string;
  password: string;
  name: string;
  city: string;
  street: string;
  passwordConfirm: string;
}

export default function Register() {
  let history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');

  const [errors, setErrors] = useState<Errors>(new Errors());

  const register = async () => {
    if (!isValid()) return;

    let newUser = new NewUser(
      email,
      password,
      passwordConfirm,
      name,
      city,
      street
    );

    let response = await Service.register(newUser);
    handleResponse(response, () => {
      history.push({
        pathname: routes.SUCCESS_REGISTRATION,
        state: { trialPeriod: response.data }
      });
    });
  };

  const isValid = () => {
    let errors = new Errors();

    if (password == '') errors.password = '*Lozinka je obavezno polje';
    else if (passwordConfirm !== password)
      errors.password = '*Lozinke se ne poklapaju';
    else if (password.length < 8)
      errors.password = '*Lozinka mora imati najmanje 8 karaktera';
    if (name == '') errors.name = '*Naziv ustanove je obavezno polje';
    if (city == '') errors.city = '*Naziv grada je obavezno polje';
    if (street == '') errors.street = '*Naziv ulice je obavezno polje';
    if (email == '') errors.email = '*Email je obavezno polje';

    setErrors(errors);
    return !errors.hasAny();
  };

  return (
    <AuthenticationCard width={500}>
      <Form>
        <Form.Group>
          <Form.Label>Naziv ustanove</Form.Label>
          <Form.Control
            placeholder="Unesite naziv ustanove"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.currentTarget.value);
            }}
          />
          <ErrorText text={errors.name} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Grad</Form.Label>
          <Form.Control
            placeholder="Unesite naziv grada"
            value={city}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setCity(e.currentTarget.value);
            }}
          />
          <ErrorText text={errors.city} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ulica i broj</Form.Label>
          <Form.Control
            placeholder="Unesite naziv ulice i broj"
            value={street}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setStreet(e.currentTarget.value);
            }}
          />
          {<ErrorText text={errors.street} />}
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
